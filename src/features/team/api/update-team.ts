"use server"

import prisma from "@dcat23/lib/prisma";
import { withTeamAuth } from "@dcat23/lib/auth";
import { addDomainToVercel, removeDomainFromVercelProject, validDomainRegex } from "@dcat23/lib/domains";
import { getBlurDataURL } from "@dcat23/lib/utils";
import { put } from "@vercel/blob";
import { nanoid } from "ai";
import { revalidateTag } from "next/cache";

export const updateTeam = withTeamAuth(
  async (formData: FormData, team: Team, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("macchiato.life")) {
          return {
            error: "Cannot use macchiato.life subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.team.update({
            where: {
              id: team.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.team.update({
            where: {
              id: team.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the team had a different customDomain before, we need to remove it from Vercel
        if (team.customDomain && team.customDomain !== value) {
          response = await removeDomainFromVercelProject(team.customDomain);

          /* Optional: remove domain from Vercel team

          // first, we need to check if the apex domain is being used by other teams
          const apexDomain = getApexDomain(`https://${team.customDomain}`);
          const domainCount = await prisma.team.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other teams
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(team.customDomain);
          } else {
            // this is the only team using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              team.customDomain
            );
          }

          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated team data! Revalidating tags: ",
        `${team.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${team.customDomain}-metadata`,
      );
      await revalidateTag(
        `${team.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      team.customDomain &&
        (await revalidateTag(`${team.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

"use server"

import { withNoteAuth } from "@dcat23/lib/auth";
import { getBlurDataURL } from "@dcat23/lib/utils";
import { put } from "@vercel/blob";
import { nanoid } from "ai";
import { revalidateTag } from "next/cache";
import prisma from "@dcat23/lib/prisma";


export const updateNoteMetadata = withNoteAuth(
  async (
    formData: FormData,
    note: Note & {
      team: Team;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get("image") as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = await getBlurDataURL(url);

        response = await prisma.note.update({
          where: {
            id: note.id,
          },
          data: {
            image: url,
            imageBlurhash: blurhash,
          },
        });
      } else {
        response = await prisma.note.update({
          where: {
            id: note.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }

      await revalidateTag(
        `${note.team?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-notes`,
      );
      await revalidateTag(
        `${note.team?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${note.slug}`,
      );

      // if the team has a custom domain, we need to revalidate those tags too
      note.team?.customDomain &&
        (await revalidateTag(`${note.team?.customDomain}-notes`),
        await revalidateTag(`${note.team?.customDomain}-${note.slug}`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

"use server"

import { getSession, withTeamAuth } from "@dcat23/lib/auth";
import { revalidateTag } from "next/cache";
import prisma from '@dcat23/lib/prisma'

export const createNote = withTeamAuth(async (_: FormData, team: Team) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const response = await prisma.note.create({
    data: {
      teamId: team.id,
      userId: session.user.id,
    },
  });

  await revalidateTag(
    `${team.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-notes`,
  );
  team.customDomain && (await revalidateTag(`${team.customDomain}-notes`));

  return response;
});

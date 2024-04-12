import prisma from '@dcat23/lib/prisma'
import { withTeamAuth } from "@dcat23/lib/auth";
import { revalidateTag } from "next/cache";

export const deleteTeam = withTeamAuth(async (_: FormData, team: Team) => {
  try {
    const response = await prisma.team.delete({
      where: {
        id: team.id,
      },
    });
    await revalidateTag(
      `${team.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (await revalidateTag(`${team.customDomain}-metadata`));
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

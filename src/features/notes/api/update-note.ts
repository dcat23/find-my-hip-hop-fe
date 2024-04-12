"use server"

import { getSession } from '@dcat23/lib/auth';
import { Note } from '@prisma/client'
import prisma from '@dcat23/lib/prisma'
import { revalidateTag } from 'next/cache';

// creating a separate function for this because we're not using FormData
export const updateNote = async (data: Note) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const note = await prisma.note.findUnique({
    where: {
      id: data.id,
    },
    include: {
      team: true,
    },
  });
  if (!note || note.userId !== session.user.id) {
    return {
      error: "Note not found",
    };
  }
  try {
    const response = await prisma.note.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
      },
    });

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
    return {
      error: error.message,
    };
  }
};

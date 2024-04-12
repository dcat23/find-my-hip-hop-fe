"use server"

import { withNoteAuth } from "@dcat23/lib/auth";
import prisma from "@dcat23/lib/prisma";
import { Note } from "@prisma/client";


export const deleteNote = withNoteAuth(async (_: FormData, note: Note) => {
  try {
    const response = await prisma.note.delete({
      where: {
        id: note.id,
      },
      select: {
        teamId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

import axios from "axios";
import { ITeam } from "../types";
import prisma from '@dcat23/lib/prisma'

export const getTeamFromNote = async (noteId: string) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
      select: {
        teamId: true,
      },
    });
    return note?.teamId;
  } catch (error: any) {
    return error.message;
  }
};

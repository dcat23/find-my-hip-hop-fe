import { Note } from "@prisma/client"

export type NoteWithTeam = Note & { team: { subdomain: string | null } | null };
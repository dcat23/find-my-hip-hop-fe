import { getSession } from "@dcat23/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@dcat23/lib/prisma";
import { NoteCard } from "./note-card";
import Image from "next/image";

export async function Notes({
  teamId,
  limit,
}: {
  teamId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id as string,
      ...(teamId ? { teamId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      team: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return notes.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} data={note} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Notes Yet</h1>
      <Image
        alt="missing note"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any notes yet. Create one to get started.
      </p>
    </div>
  );
}

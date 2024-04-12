import { getSession } from "@dcat23/lib/auth";
import prisma from "@dcat23/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Editor } from "@dcat23/features/editor";

export default async function NotePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.note.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      team: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return <Editor note={data} />;
}

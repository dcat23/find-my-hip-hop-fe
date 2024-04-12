import { getSession } from "@dcat23/lib/auth";
import prisma from "@dcat23/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@dcat23/components/form";
import { updateNoteMetadata, DeleteNoteForm } from "@dcat23/features/notes";

export default async function NoteSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.note.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Note Settings
        </h1>
        <Form
          title="Note Slug"
          description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
          helpText="Please use a slug that is unique to this note."
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: data?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updateNoteMetadata}
        />

        <Form
          title="Thumbnail image"
          description="The thumbnail image for your note. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateNoteMetadata}
        />

        <DeleteNoteForm noteName={data?.title!} />
      </div>
    </div>
  );
}

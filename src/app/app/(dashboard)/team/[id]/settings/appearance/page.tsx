import prisma from "@dcat23/lib/prisma";
import Form from "@dcat23/components/form";
import { updateTeam } from "@dcat23/features/team";

export default async function TeamSettingsAppearance({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.team.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Thumbnail image"
        description="The thumbnail image for your team. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "image",
          type: "file",
          defaultValue: data?.image!,
        }}
        handleSubmit={updateTeam}
      />
      <Form
        title="Logo"
        description="The logo for your team. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 400x400."
        inputAttrs={{
          name: "logo",
          type: "file",
          defaultValue: data?.logo!,
        }}
        handleSubmit={updateTeam}
      />
      <Form
        title="Font"
        description="The font for the heading text your team."
        helpText="Please select a font."
        inputAttrs={{
          name: "font",
          type: "select",
          defaultValue: data?.font!,
        }}
        handleSubmit={updateTeam}
      />
      <Form
        title="404 Page Message"
        description="Message to be displayed on the 404 page."
        helpText="Please use 240 characters maximum."
        inputAttrs={{
          name: "message404",
          type: "text",
          defaultValue: data?.message404!,
          placeholder: "Blimey! You've found a page that doesn't exist.",
          maxLength: 240,
        }}
        handleSubmit={updateTeam}
      />
    </div>
  );
}

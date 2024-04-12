import prisma from "@dcat23/lib/prisma";
import Form from "@dcat23/components/form";
import { updateTeam, DeleteTeamForm } from "@dcat23/features/team";


export default async function TeamSettingsIndex({
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
        title="Name"
        description="The name of your team. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Team",
          maxLength: 32,
        }}
        handleSubmit={updateTeam}
      />

      <Form
        title="Description"
        description="The description of your team. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateTeam}
      />

      <DeleteTeamForm teamName={data?.name!} />
    </div>
  );
}

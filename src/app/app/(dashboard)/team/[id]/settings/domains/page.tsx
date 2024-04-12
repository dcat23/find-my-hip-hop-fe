import prisma from "@dcat23/lib/prisma";
import Form from "@dcat23/components/form";
import { updateTeam } from "@dcat23/features/team";

export default async function TeamSettingsDomains({
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
        title="Subdomain"
        description="The subdomain for your team."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "subdomain",
          type: "text",
          defaultValue: data?.subdomain!,
          placeholder: "subdomain",
          maxLength: 32,
        }}
        handleSubmit={updateTeam}
      />
      <Form
        title="Custom Domain"
        description="The custom domain for your team."
        helpText="Please enter a valid domain."
        inputAttrs={{
          name: "customDomain",
          type: "text",
          defaultValue: data?.customDomain!,
          placeholder: "yourdomain.com",
          maxLength: 64,
          pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
        }}
        handleSubmit={updateTeam}
      />
    </div>
  );
}

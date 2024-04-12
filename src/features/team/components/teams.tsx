import { getSession } from "@dcat23/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@dcat23/lib/prisma";
import { TeamCard } from "./team-card";
import Image from "next/image";

export async function Teams({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const teams = await prisma.team.findMany({
    where: {
      user: {
        id: session.user.id as string,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return teams.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {teams.map((team) => (
        <TeamCard key={team.id} data={team} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Teams Yet</h1>
      <Image
        alt="missing team"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any teams yet. Create one to get started.
      </p>
    </div>
  );
}

import { Suspense } from "react";
import { Teams } from "@dcat23/features/team";
import PlaceholderCard from "@dcat23/components/placeholder-card";
import { CreateTeamButton, CreateTeamModal } from "@dcat23/features/modal";

export default function AllTeams({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Teams
          </h1>
          <CreateTeamButton>
            <CreateTeamModal />
          </CreateTeamButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Teams teamId={decodeURIComponent(params.id)} />
        </Suspense>
      </div>
    </div>
  );
}

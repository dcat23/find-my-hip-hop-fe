import { Suspense } from "react";
import Sites from "@dcat23/components/sites";
import PlaceholderCard from "@dcat23/components/placeholder-card";
import CreateSiteButton from "@dcat23/components/create-site-button";
import CreateSiteModal from "@dcat23/components/modal/create-site";

export default function AllSites({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Sites
          </h1>
          <CreateSiteButton>
            <CreateSiteModal />
          </CreateSiteButton>
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
          <Sites siteId={decodeURIComponent(params.id)} />
        </Suspense>
      </div>
    </div>
  );
}

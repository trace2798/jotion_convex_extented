"use client";
import AvatarCard from "@/components/avatar-card";
import { SearchCommand } from "@/components/search-command";
import { Spinner } from "@/components/spinner";
import { getSpaceNameFromUrl } from "@/utils/helpers";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  const spaceName = getSpaceNameFromUrl();
  console.log(spaceName);

  return (
    <>
      <AvatarCard nameOfSpace={spaceName?? "documents"} />
      <div className="h-full flex">
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
    </>
  );
};

export default DocumentLayout;

"use client";
import { SearchCommand } from "@/components/search-command";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";
import AvatarCard from "@/components/avatar-card";
import { getSpaceNameFromUrl } from "@/utils/helpers";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
      {/* <AvatarCard nameOfSpace={spaceName ?? "documents"} /> */}
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigation />
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;

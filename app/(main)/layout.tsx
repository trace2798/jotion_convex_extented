"use client";
// import { AblyClientProvider } from "@/components/ably-provider";
// import AvatarCard from "@/components/avatar-card";
import { SearchCommand } from "@/components/search-command";
// import { SpaceContextProvider } from "@/components/space-context";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";

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

  return (
    // <AblyClientProvider>
    //   <SpaceContextProvider example="member-locations">
    //     <AvatarCard />
        <div className="h-full flex dark:bg-[#1F1F1F]">
          <Navigation />
          <main className="flex-1 h-full overflow-y-auto">
            <SearchCommand />
            {children}
          </main>
        </div>
    //   </SpaceContextProvider>
    // </AblyClientProvider>
  );
};

export default MainLayout;

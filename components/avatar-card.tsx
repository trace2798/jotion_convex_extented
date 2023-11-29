import { FC } from "react";
import AvatarStack from "./avatar-stack";
import ChatHome from "./home-chat";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { useParams } from "next/navigation";
import ChatSheet from "./chat-sheet";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface AvatarCardProps {}

const AvatarCard: FC<AvatarCardProps> = () => {
  const params = useParams();

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }
  return (
    <>
      <Card className="fixed right-8 max-w-[300px] bottom-4 p-3 border border-gray-500 flex flex-row items-center justify-center z-[99]">
        {!params.documentId ? (
          <ChatHome channelName="main-chat" />
        ) : (
          "Right Top"
        )}
        <Separator
          orientation="vertical"
          className="bg-indigo-500 h-[30px] mx-2"
        />
        <AvatarStack />
      </Card>
    </>
  );
};

export default AvatarCard;

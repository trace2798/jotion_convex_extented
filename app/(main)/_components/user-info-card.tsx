"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FC } from "react";

interface UserInfoCardProps {}

const UserInfoCard: FC<UserInfoCardProps> = ({}) => {
  const { user } = useUser();
  return (
    <>
      <HoverCard>
        <HoverCardTrigger className="flex flex-col">
          <div
            role="button"
            className="flex justify-center items-center text-sm p-3 w-full hover:bg-primary/5"
          >
            <div className="flex gap-x-2 items-center">
              <Avatar className="h-7 w-7 rounded-full">
                <AvatarImage src={user?.imageUrl} className="rounded-full" />
              </Avatar>
              <span className="text-start font-medium line-clamp-1">
                {user?.fullName}
              </span>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-fit text-sm font-switzerRegular">
          {user?.emailAddresses[0].emailAddress}
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default UserInfoCard;

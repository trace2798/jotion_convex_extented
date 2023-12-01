"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Member, getInitials } from "@/utils/helpers";
import { useUser } from "@clerk/clerk-react";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";

interface AvatarOtherProps {
  users: Member[];
}

const AvatarOther: FC<AvatarOtherProps> = ({ users }) => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const loggedInUser = users.filter((u) => u.userId === user.id);
  const otherUsers = users.filter((u) => u.userId !== user.id);
  const orderedUsers = [...loggedInUser, ...otherUsers];

  return (
    <>
      {orderedUsers.map((user, index) => {
        console.log(user);
        return (
          <HoverCard key={index}>
            <HoverCardTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`${user?.userPicture || "default_image_url"}`}
                  alt={`image of`}
                />
                <AvatarFallback>{getInitials(user.userName)}</AvatarFallback>
                <div
                  className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
                  id="status-indicator"
                />
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="capitalize">
              {user?.userName}
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </>
  );
};

export default AvatarOther;

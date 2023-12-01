"use client";
import { useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useMemo } from "react";
import { SpacesContext } from "./space-context";
import useMembers from "../hooks/useMembers";
import { getSpaceNameFromUrl, type Member } from "../utils/helpers";
import { getMemberColor } from "../utils/mockColors";
import AblyAvatars from "./ably-avatar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, useParams, usePathname } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getInitials } from "@/utils/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AvatarStack = () => {
  const { user } = useUser();
  const name = useMemo(() => user?.fullName, [user]);
  const imageUrl = useMemo(() => user?.imageUrl, [user]);
  // const memberColor = useMemo(getMemberColor, []);
  console.log(user?.id);
  /** 💡 Get a handle on a space instance 💡 */
  if (!user) {
    redirect("/");
  }
  const updatePresence = useMutation(api.presence.updatePresence);
  console.log(updatePresence);
  const spaceName = getSpaceNameFromUrl();
  useEffect(() => {
    if (user?.id) {
      updatePresence({
        userId: user.id,
        lastActive: Date.now(),
        location: spaceName, // replace with actual route
        userName: name ?? "",
        userPicture: imageUrl ?? "",
      });
    }
  }, [user?.id, updatePresence]);

  const users = useQuery(api.presence.getHomePresence, {
    location: spaceName ?? "documents", // replace with actual route
  });
  console.log(users);
  console.log(users?.length);

  return (
    <div id="avatar-stack bg-white">
      {/* Avatar STack displyed here */}
      {users?.map((user, index) => (
        <div className="flex flex-row">
          <HoverCard key={index}>
            <HoverCardTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`${user?.userPicture ?? "default_image_url"}`}
                  alt={`image of`}
                />
                <AvatarFallback>
                  {getInitials(user.userName ?? "")}
                </AvatarFallback>
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
        </div>
      ))}
      {/** 💡 Stack of first 6 user avatars including yourself.💡 */}
      {/* <AblyAvatars otherUsers={uniqueUsers as Member[]} /> */}
    </div>
  );
};

export default AvatarStack;

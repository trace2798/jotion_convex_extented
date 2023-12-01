"use client";
import { useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useMemo } from "react";
import { SpacesContext } from "./space-context";
import useMembers from "../hooks/useMembers";
import { getSpaceNameFromUrl, type Member } from "../utils/helpers";
import { getMemberColor } from "../utils/mockColors";
import HomeAvatars from "./home-avatar";
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
  const activeUsers = users?.filter(
    (user) => Date.now() - user.lastActive <= 1 * 60 * 1000
  );
  console.log(activeUsers?.length);
  if (!activeUsers) {
    return <div>No Active Users</div>;
  }
  return (
    <div id="" className="w-full flex">
      {/** 💡 Stack of first 6 user avatars including yourself.💡 */}
      <HomeAvatars otherUsers={activeUsers as Member[]} />
    </div>
  );
};

export default AvatarStack;

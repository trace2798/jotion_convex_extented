"use client";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo } from "react";
import { getSpaceNameFromUrl, type Member } from "../utils/helpers";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import Avatars from "./online-avatar";

const AvatarStack = ({ nameOfSpace }: { nameOfSpace: string }) => {
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
  // const spaceName = getSpaceNameFromUrl();
  useEffect(() => {
    if (user?.id) {
      updatePresence({
        userId: user.id,
        lastActive: Date.now(),
        location: nameOfSpace,
        userName: name ?? "",
        userPicture: imageUrl ?? "",
      });
    }
  }, [user?.id, updatePresence]);
  // console.log(spaceName);
  const users = useQuery(api.presence.getHomePresence, {
    location: nameOfSpace ?? "documents",
  });
  console.log(users);
  console.log(users?.length);
  const activeUsers = users?.filter(
    (user) => Date.now() - user.lastActive <= 2 * 60 * 1000
  );
  console.log(activeUsers?.length);
  if (!activeUsers || activeUsers.length === 0) {
    return <div>No Active Users</div>;
  }
  return (
    <div className="w-full flex">
      {/** 💡 Stack of first 6 user avatars including yourself.💡 */}
      <Avatars users={activeUsers as Member[]} />
      {/* {nameOfSpace === "documents" ? (
        <Avatars users={activeUsers as Member[]} />
      ) : (
        <h1>Only shown in home</h1>
      )} */}
    </div>
  );
};

export default AvatarStack;

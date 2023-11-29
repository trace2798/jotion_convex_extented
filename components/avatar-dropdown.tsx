"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAX_USERS_BEFORE_LIST, Member, getInitials } from "@/utils/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AvatarDropdownProps {
  otherUsers: Member[];
}

const AvatarDropdown: FC<AvatarDropdownProps> = ({ otherUsers }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-2 h-8 w-8 rounded-full border border-muted-foreground">
          +{otherUsers.slice(MAX_USERS_BEFORE_LIST).length}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col">
          <DropdownMenuLabel>Online Users</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <>
            {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user, index) => (
              <DropdownMenuItem
                className="hover:bg-slate-700 hover:rounded-lg px-2 py-2 md:px-3"
                key={index}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`${user?.profileData.imageUrl || "default_image_url"}`}
                    alt={`image of`}
                  />
                  <AvatarFallback>
                    {getInitials(user.profileData.name)}
                  </AvatarFallback>
                  <div
                    className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
                    id="status-indicator"
                  />
                </Avatar>
                <h1 className="ml-3 capitalize">{user.profileData.name}</h1>
              </DropdownMenuItem>
            ))}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AvatarDropdown;

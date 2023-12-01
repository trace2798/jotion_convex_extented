"use client";
import type { Member } from "../utils/helpers";
import { MAX_USERS_BEFORE_LIST } from "../utils/helpers";
import AvatarDropdown from "./avatar-dropdown";
import AvatarOther from "./avatar-other";
import AvatarSelf from "./avatar-self";
import { Separator } from "./ui/separator";

const HomeAvatars = ({ otherUsers }: { otherUsers: any[] }) => {
  return (
    <div className="relative flex">
      <AvatarOther
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {otherUsers.length <= MAX_USERS_BEFORE_LIST ? (
        ""
      ) : (
        <AvatarDropdown otherUsers={otherUsers} />
      )}
    </div>
  );
};

export default HomeAvatars;

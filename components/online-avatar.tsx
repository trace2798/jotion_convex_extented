"use client";
import type { Member } from "../utils/helpers";
import { MAX_USERS_BEFORE_LIST } from "../utils/helpers";
import AvatarDisplay from "./avatar-display";
import AvatarDropdown from "./avatar-dropdown";

const Avatars = ({ users }: { users: Member[] }) => {
  return (
    <div className="relative flex">
      <AvatarDisplay
        users={users.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {users.length <= MAX_USERS_BEFORE_LIST ? (
        ""
      ) : (
        <AvatarDropdown otherUsers={users} />
      )}
    </div>
  );
};

export default Avatars;

// import { type SpaceMember } from "@ably/spaces";

import { SpaceMember } from "@ably/spaces";

export const colours = [
  { nameColor: "bg-orange-700", cursorColor: "#FE372B" },
  { nameColor: "bg-pink-700", cursorColor: "#9C007E" },
  { nameColor: "bg-green-700", cursorColor: "#008E06" },
  { nameColor: "bg-purple-700", cursorColor: "#460894" },
  { nameColor: "bg-blue-700", cursorColor: "#0284CD" },
  { nameColor: "bg-yellow-700", cursorColor: "#AC8600" },
  { nameColor: "bg-orange-500", cursorColor: "#FF723F" },
  { nameColor: "bg-pink-500", cursorColor: "#FF17D2" },
  { nameColor: "bg-green-500", cursorColor: "#00E80B" },
  { nameColor: "bg-purple-500", cursorColor: "#7A1BF2" },
  { nameColor: "bg-blue-500", cursorColor: "#2CC0FF" },
  { nameColor: "bg-yellow-500", cursorColor: "#FFC700" },
];

export const getSpaceNameFromUrl = () => {
  const url = new URL(window.location.href);
  const spaceNameInParams = url.searchParams.get("space");
  // console.log(url, "URL");
  if (spaceNameInParams) {
    return spaceNameInParams;
  } else {
    // Extract the document ID from the pathname
    const documentId = url.pathname.split("/").pop();
    url.searchParams.set("space", documentId as string);
    window.history.replaceState({}, "", `?${url.searchParams.toString()}`);
    return documentId;
  }
};

export const REMOVE_USER_AFTER_MILLIS = 120_000;
export const MAX_USERS_BEFORE_LIST = 6;

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; name: string; imageUrl?: string };
};

export type Message = {
  author: string;
  content: string;
  timestamp: Date;
  id: string;
  deleted?: boolean;
};


export const getInitials = (name: string) => {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].charAt(0);
  }
  const firstLetter = words[0].charAt(0);
  const lastLetter = words[words.length - 1].charAt(0);
  return `${firstLetter}${lastLetter}`;
};

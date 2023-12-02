
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
export const MAX_USERS_BEFORE_LIST = 5;

export type Member = {
  userId: string;
  lastActive: number;
  location: string;
  userPicture: string;
  userName: string;
};

export type Message = {
  _creationTime: number;
  _id: string;
  documentId: string;
  message: string;
  userId: string;
  userName: string;
  isArchived: boolean;
};

export type HomeMessage = {
  _creationTime: number;
  _id: string;
  message: string;
  userId: string;
  userName: string;
  isArchived: boolean;
};

export const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0);
  }
  const firstLetter = words[0].charAt(0);
  const lastLetter = words[words.length - 1].charAt(0);
  return `${firstLetter}${lastLetter}`;
};

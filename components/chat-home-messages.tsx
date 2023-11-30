"use client";
import { HomeMessage } from "@/utils/helpers";
import { FC } from "react";
import { Trash } from "lucide-react";
import { format } from "date-fns";

interface ChatHomeMessagesProps {
  message: HomeMessage;
  isOwnMessage: boolean;
  // deleteMessage: (mid: string) => () => void;
}

const ChatHomeMessages: FC<ChatHomeMessagesProps> = ({
  message,
  isOwnMessage,
  // deleteMessage,
}) => {
  return (
    <>
      <div
        className={`mb-12 mt-5  items-baseline relative ${
          isOwnMessage ? "flex flex-col justify-end" : "flex-row"
        }`}
      >
        <div
          className={`${
            isOwnMessage ? "ml-auto bg-indigo-400" : " bg-slate-800"
          } py-1 px-2 rounded-lg w-[350px]`}
        >
          <p
            className={`${
              isOwnMessage ? "text-muted" : "text-slate-400"
            } font-bold`}
          >
            {message.userName} {isOwnMessage ? "(you)" : ""}
          </p>
          <p className="text-white">{message.message}</p>
          <p
            className={`${
              isOwnMessage ? "text-blue-100" : "text-slate-400"
            } font-switzerLight mt-3`}
          >
            {format(new Date(message._creationTime), "iiii, do MMMM, yyyy p")}
          </p>
        </div>
        <div className="flex flex-col justify-between">
          {/* <button
            className={` cursor-pointer disabled:cursor-default absolute -bottom-7 p-0 ${
              isOwnMessage ? "text-right right-2" : "left-2"
            } ${!isOwnMessage || message.deleted ? "hidden" : ""} transition`}
            disabled={!isOwnMessage}
            onClick={deleteMessage(message.id)}
            aria-label="Trash button to delete Message. Mod of the chat can delete all the messages."
            // variant="ghost"
          >
            <Trash className="w-4 h-4 hover:text-red-700 text-slate-950 dark:text-neutral-200" />
          </button> */}
        </div>
      </div>
    </>
  );
};

export default ChatHomeMessages;

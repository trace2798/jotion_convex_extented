"use client";
import { Message } from "@/utils/helpers";
import { FC } from "react";
import { Trash } from "lucide-react";

interface AblyMessagesProps {
  message: Message;
  isOwnMessage: boolean;
  isModerator: boolean;
  deleteMessage: (mid: string) => () => void;
}

const AblyMessages: FC<AblyMessagesProps> = ({
  message,
  isOwnMessage,
  isModerator,
  deleteMessage,
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
            {message.author} {isOwnMessage ? "(you)" : ""}
          </p>
          <p
            className={`text-base text-slate-600 ${
              message.deleted
                ? "italic text-white dark:text-neutral-200"
                : "text-white"
            }`}
          >
            {message.deleted
              ? "This message has been deleted."
              : message.content}
          </p>
        </div>
        <div className="flex flex-col justify-between">
          <button
            className={` cursor-pointer disabled:cursor-default absolute -bottom-7 p-0 ${
              isOwnMessage ? "text-right right-2" : "left-2"
            } ${
              (!isModerator && !isOwnMessage) || message.deleted ? "hidden" : ""
            } transition`}
            disabled={!isModerator && !isOwnMessage}
            onClick={deleteMessage(message.id)}
            aria-label="Trash button to delete Message. Mod of the chat can delete all the messages."
          >
            <Trash className="w-4 h-4 hover:text-red-700 text-slate-950 dark:text-neutral-200" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AblyMessages;

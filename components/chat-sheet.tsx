"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/utils/helpers";
import { useUser } from "@clerk/clerk-react";
import { redirect, useParams } from "next/navigation";
import { ElementRef, useEffect, useReducer, useRef, useState } from "react";
import ChatMessages from "./chat-messages";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

const ChatSheet = ({ creatorId }: { creatorId: string }) => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const params = useParams();
  const isModerator = user.id === creatorId;
  const scrollRef = useRef<ElementRef<"div">>(null);
  const author = user.fullName;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const sendAMessage = useMutation(api.documents.sendMessage);

  const sendMessage = () => {
    console.log(params, message);
    const promise = sendAMessage({
      documentId: params.documentId as Id<"documents">,
      message,
      userName: user.fullName ?? "Anonymous",
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });

    toast.promise(promise, {
      loading: "Sending your message...",
      success: "Message sent",
      error: "Failed to Sent Message.",
    });
    setMessage("");
  };

  const messages = useQuery(api.documents.getMessages, {
    documentId: params.documentId as Id<"documents">,
  });
  console.log(messages, "MESSAGES");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-muted-foreground rounded-full hover:bg-zinc-300 dark:hover:bg-gray-600 hover:text-indigo-700 dark:hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          {" "}
          <HoverCard>
            <HoverCardTrigger>
              <svg
                className=" h-6 w-6 stroke-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              <span className="sr-only">Write a message</span>
            </HoverCardTrigger>
            <HoverCardContent className="capitalize bg-inherit text-sm border-none shadow-none">
              Click to chat
            </HoverCardContent>
          </HoverCard>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[100vw] md:w-[50vw] lg:w-[30vw] mt-12">
        <ScrollArea
          className={cn(
            "border-none max-h-[70vh] overflow-y-auto px-5 bg-text-muted w-full transition flex text-sm flex-col rounded-2xl",
            {
              "bg-slate-900": isModerator,
            }
          )}
        >
          {messages === undefined || messages.length === 0 ? (
            <div className="w-full h-24 flex text-center justify-center items-center">
              <h1>Oops. Looks like you have not started chatting.</h1>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessages
                message={message}
                isOwnMessage={message.userName === author}
                // deleteMessage={deleteMessage}
                isModerator={isModerator}
                key={index}
              />
              // <h1>{message.message}</h1>
            ))
          )}
          <div ref={scrollRef} />
        </ScrollArea>
        {typingUsers.length > 0 && (
          <p className="text-xs">{typingUsers.join(", ")} is typing...</p>
        )}
        <Input
          type="text"
          disabled={loading}
          className="mt-5"
          placeholder="Send a Message to get started"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          // onKeyDown={handleKeyDown}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
            // handleKeyDown();
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;

"use client";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatHomeMessages from "./chat-home-messages";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const ChatHome = () => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }

  const scrollRef = useRef<ElementRef<"div">>(null);
  const author = user.fullName;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const sendAMessage = useMutation(api.documents.sendHomeMessage);

  const sendMessage = () => {
    console.log(message);
    const promise = sendAMessage({
      message,
      userName: user.fullName ?? "Anonymous",
    });

    toast.promise(promise, {
      loading: "Sending your message...",
      success: "Message sent",
      error: "Failed to Sent Message.",
    });
    setMessage("");
  };
  // console.log(author)
  const messages = useQuery(api.documents.getHomeMessages);
  console.log(messages, "MESSAGES");

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        (scrollRef.current as ElementRef<"div">).scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // Adjust delay as needed
    }
  }, [messages]);
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild defaultChecked>
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
            "border-none max-h-[70vh] overflow-y-auto px-5 bg-text-muted w-full transition flex text-sm flex-col rounded-2xl"
          )}
        >
          {messages === undefined || messages.length === 0 ? (
            <div className="w-full h-24 flex text-center justify-center items-center">
              <h1>Oops. Looks like you have not started chatting.</h1>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatHomeMessages
                message={message}
                isOwnMessage={message.userName === author}
                key={index}
              />
            ))
          )}

          <div ref={scrollRef} />
        </ScrollArea>
        <Input
          type="text"
          disabled={loading}
          className="mt-5"
          placeholder="Send a Message to get started"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatHome;

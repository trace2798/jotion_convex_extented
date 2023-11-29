"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/utils/helpers";
import { useUser } from "@clerk/clerk-react";
import { Types } from "ably";
import { useChannel } from "ably/react";
import { redirect } from "next/navigation";
import { ElementRef, useEffect, useReducer, useRef, useState } from "react";
import AblyHomeMessages from "./ably-home-messages";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type MessageSendEvent = { type: "send"; message: Message; id: string };
type MessageClearEvent = { type: "clear" };
type MessageDeleteEvent = { type: "delete"; [key: string]: any };

type MessageDispatch =
  | MessageSendEvent
  | MessageClearEvent
  | MessageDeleteEvent;

const ChatHome = ({ channelName }: { channelName: string }) => {
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

  // Function to start typing
  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      channel.presence.update({ typing: true, name: user.fullName });
    }
  };

  // Function to stop typing
  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      channel.presence.update({ typing: false, name: user.fullName });
    }
  };

  const handleKeyDown = () => {
    startTyping();
    setTimeout(stopTyping, 3000);
  };

  const messageReducer = (
    state: Message[],
    action: MessageDispatch
  ): Message[] => {
    switch (action.type) {
      case "send":
        action.message.id = action.id;
        return state.concat(action.message);
      case "delete":
        return state.map((m) =>
          !(m.author !== author && action.extras?.userClaim === "user") &&
          m.id === action.extras.ref.timeserial
            ? { ...m, deleted: true }
            : m
        );
      case "clear":
        return [];
      default:
        return state;
    }
  };
  const [messages, dispatchMessage] = useReducer(messageReducer, []);

  // 💡 Transforms the message from ably into the format that the reducer expects
  const handleMessage = (msg: Types.Message) => {
    dispatchMessage({ type: msg.name, id: msg.id, ...msg.data });
  };

  const { channel } = useChannel(channelName, handleMessage);
  // console.log(channel, "CHANNEl");
  useEffect(() => {
    const onPresenceUpdate = (member: any) => {
      // console.log(member, "MEMBER");
      if (member.data.typing) {
        setTypingUsers((users) => [...users, member.data.name]);
        // console.log(user, "USER");
      } else {
        setTypingUsers((users) =>
          users.filter((id) => id !== member.data.name)
        );
      }
    };
    // {
    //   console.log(onPresenceUpdate, "PRESENCE UPDATE");
    // }
    channel.presence.subscribe("update", onPresenceUpdate);
    return () => {
      channel.presence.unsubscribe("update", onPresenceUpdate);
    };
  }, [channel]);

  // 💡 Handles pressing enter or the send button
  const sendMessage = () => {
    if (message.length === 0) return;

    channel.publish("send", {
      message: { author, content: message, timestamp: new Date() },
    });
    setMessage("");
  };

  // 💡 Handles pressing the delete button
  const deleteMessage = (mid: string) => {
    return () => {
      // 💡 Send a message interaction for the target message with the `com.ably.delete` reference type
      channel.publish("delete", {
        user: author,
        extras: {
          ref: { type: "com.ably.delete", timeserial: mid },
        },
      });
    };
  };

  // 💡 Effect to replay the message history, and add an initial message to new sessions
  useEffect(() => {
    channel.history((err: any, result: { items: Types.Message[] }) => {
      if (err || !result) return;
      if (result.items.length === 0) {
        return null;
      } else {
        result.items.reverse().forEach(handleMessage);
      }
    });

    return () => {
      dispatchMessage({ type: "clear" });
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild defaultChecked>
        {/* <Button variant="outline">Open Chat</Button> */}
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
          {messages.length === 0 ? (
            <div className="w-full h-24 flex text-center justify-center items-center">
              <h1>Oops. Looks like you have not started chatting.</h1>
            </div>
          ) : (
            messages.map((message, index) => (
              <AblyHomeMessages
                message={message}
                isOwnMessage={message.author === author}
                deleteMessage={deleteMessage}
                key={index}
              />
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
            handleKeyDown();
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatHome;

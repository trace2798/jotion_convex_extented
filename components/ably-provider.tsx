// "use client";
// import { ReactNode } from "react";
// // import { ClerkProvider, useAuth, useSession } from "@clerk/clerk-react";
// import { AblyProvider } from "ably/react";
// import { nanoid } from "nanoid";
// import { Realtime } from "ably";

// const client = new Realtime.Promise({
//   clientId: nanoid(),
//   key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
// });
// console.log("CLIENT", client);

// export const AblyClientProvider = ({ children }: { children: ReactNode }) => {
//   return <AblyProvider client={client}>{children}</AblyProvider>;
// };
"use client";
import { ReactNode } from "react";
import { AblyProvider } from "ably/react";
import { Realtime } from "ably";
import { useUser } from "@clerk/clerk-react";
import { redirect } from "next/navigation";

export const AblyClientProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const client = new Realtime.Promise({
    clientId: user.id,
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  });

  return <AblyProvider client={client}>{children}</AblyProvider>;
};

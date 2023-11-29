"use client";
import { useMemo, useRef, useEffect, useContext } from "react";
import { colours } from "../utils/helpers";
import useSpaceMembers from "../hooks/useMembers";
import { MemberCursors, YourCursor } from "./cursors";
import { SpacesContext } from "./space-context";
import { useUser } from "@clerk/clerk-react";
import type { Member } from "../utils/types";
import type { SpaceMember } from "@ably/spaces";
import { useParams } from "next/navigation";
import { Cover } from "./cover";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const LiveCursors = () => {
  const params = useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  const { user } = useUser();
  const name = user?.firstName;

  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    []
  );

  // Get the space instance from the context
  const space = useContext(SpacesContext);

  // Enter the space with the user’s name and colour when the space is ready
  useEffect(() => {
    space?.enter({ name, userColors });
  }, [space]);

  // Get the self and other members data from the custom hook
  const { self, otherMembers } = useSpaceMembers(space);
  // Create a ref for the live cursors container element
  const liveCursors = useRef(null);

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className={`absolute top-12 left-0 w-full h-full ${
        document.isEditable ? "z-0" : "z-[999]"
      }`}
    >
      <YourCursor
        self={self as Member | null}
        space={space}
        parentRef={liveCursors}
      />
      <MemberCursors
        otherUsers={
          otherMembers.filter((m: SpaceMember) => m.isConnected) as Member[]
        }
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  );
};

export default LiveCursors;

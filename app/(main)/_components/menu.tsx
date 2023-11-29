"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import {
  CircleOff,
  Globe,
  Lock,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MenuProps {
  documentId: Id<"documents">;
  creatorName: string;
  isPublic?: boolean;
  isEditable?: boolean;
}

export const Menu = ({
  documentId,
  creatorName,
  isPublic,
  isEditable,
}: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const changeVisibility = useMutation(api.documents.toggleVisibility);
  const changeEditibility = useMutation(api.documents.toggleEditibility);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  const onChangeVisibility = () => {
    const promise = changeVisibility({ id: documentId });

    toast.promise(promise, {
      loading: "Changing Visibility...",
      success: "Visibility Changed",
      error: "Failed to change visibility.",
    });

    // router.push("/documents");
  };

  const onChangeEditibility = () => {
    const promise = changeEditibility({ id: documentId });

    toast.promise(promise, {
      loading: "Changing Editing ability...",
      success: "Done. Editing ability changed",
      error:
        "Failed to change property. Only the creator can change this property",
    });
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="end"
          alignOffset={8}
          forceMount
        >
          <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="text-xs text-muted-foreground p-2">
            Created by: {creatorName}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPublic ? (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeVisibility()}
            >
              <Globe className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <Lock className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it private
          </HoverCardContent>
        </HoverCard>
      ) : (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeVisibility()}
            >
              <Lock className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <Globe className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it public
          </HoverCardContent>
        </HoverCard>
      )}
      {isEditable ? (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeEditibility()}
            >
              <Pencil className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <CircleOff className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it non-editable
          </HoverCardContent>
        </HoverCard>
      ) : (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeEditibility()}
            >
              <CircleOff className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <Pencil className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it Editable
          </HoverCardContent>
        </HoverCard>
      )}
    </>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};

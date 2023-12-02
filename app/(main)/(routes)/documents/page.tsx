"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import AvatarCard from "@/components/avatar-card";
import { getSpaceNameFromUrl } from "@/utils/helpers";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };
  const spaceName = getSpaceNameFromUrl();
  console.log(spaceName);
  return (
    <>
      <AvatarCard nameOfSpace={spaceName ?? "documents"} />
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Image
          src="/dashboard.png"
          alt="hero-image"
          width={500}
          height={500}
          className="rounded-xl"
        />
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a note
        </Button>
      </div>
    </>
  );
};

export default DocumentsPage;

"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadDropzone, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { getSpaceNameFromUrl } from "@/utils/helpers";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();

  const [file, setFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const spaceName = getSpaceNameFromUrl();
  console.log(spaceName);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  console.log(generateUploadUrl);
  const saveStorageId = useMutation(api.documents.saveStorageId);
  const result = saveStorageId.toString();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    console.log("INSIDE HANDLE UPLOAD");
    const postUrl = await generateUploadUrl({
      id: spaceName as Id<"documents">,
    });
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const body = await result.json();

    console.log(body);
    const res = await saveStorageId({
      id: spaceName as Id<"documents">,
      coverImage: body.storageId,
    });
    onClose();
  };

  const imageInput = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <form onSubmit={handleUpload}>
          <Input
            type="file"
            accept="image/*"
            ref={imageInput}
            onChange={(event) => setSelectedImage(event.target.files![0])}
            // disabled={selectedImage !== null}
          />

          <Button
            type="submit"
            value="Send Image"
            disabled={isSubmitting}
            className="hover:cursor-pointer mt-5"
          >
            Submit Image
          </Button>
        </form>
        {/* <SingleImageDropzone onChange={handleUpload}/> */}
      </DialogContent>
    </Dialog>
  );
};

// "use client";

// import { useState } from "react";
// import { useMutation } from "convex/react";
// import { useParams } from "next/navigation";

// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { useCoverImage } from "@/hooks/use-cover-image";
// import { SingleImageDropzone } from "@/components/single-image-dropzone";
// import { useEdgeStore } from "@/lib/edgestore";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";

// export const CoverImageModal = () => {
//   const params = useParams();
//   const update = useMutation(api.documents.update);
//   const coverImage = useCoverImage();
//   const { edgestore } = useEdgeStore();

//   const [file, setFile] = useState<File>();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const onClose = () => {
//     setFile(undefined);
//     setIsSubmitting(false);
//     coverImage.onClose();
//   };

//   const onChange = async (file?: File) => {
//     if (file) {
//       setIsSubmitting(true);
//       setFile(file);

//       const res = await edgestore.publicFiles.upload({
//         file,
//         options: {
//           replaceTargetUrl: coverImage.url,
//         },
//       });

//       await update({
//         id: params.documentId as Id<"documents">,
//         coverImage: res.url,
//       });

//       onClose();
//     }
//   };

//   return (
//     <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <h2 className="text-center text-lg font-semibold">Cover Image</h2>
//         </DialogHeader>
//         <SingleImageDropzone
//           className="w-full outline-none"
//           disabled={isSubmitting}
//           value={file}
//           onChange={onChange}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// };

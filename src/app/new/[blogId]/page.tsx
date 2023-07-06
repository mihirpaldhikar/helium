"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/configs/FirebaseConfig";
import { uploadBlog, uploadImage } from "@/utils/FirebaseUtils";
import { Blob, serializeBlobToHTML } from "@mihirpaldhikar/polaris";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ImageContent } from "@mihirpaldhikar/polaris/dist/cjs/types/interfaces";
import Navbar from "@/components/Navbar";
import { generateRandomString } from "@/utils/SharedUtils";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import Workspace from "@/components/Workspace";
import { createBlob } from "@/utils/BlogUtils";
import Button from "@/components/Button";

export default function CreateNewBlog({
  params,
}: {
  params: { blogId: string };
}): JSX.Element {
  const router = useRouter();
  const [user, isAccountLoading, error] = useAuthState(firebaseAuth);
  const [blob, setBlob] = useState<Blob>();
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [disablePublish, setDisabledPublish] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAccountLoading && user === null) {
      router.push("/login");
    }
  }, [isAccountLoading, router, user]);

  useEffect(() => {
    setBlob(createBlob());
    setIsEditorLoading(false);
  }, []);

  if (isEditorLoading || isAccountLoading || isLoading) {
    return <CircularProgressBar />;
  }

  if (blob === undefined) {
    return <h2>Error Occurred</h2>;
  }

  return (
    <div className={"flex w-full flex-col space-y-10"}>
      <Navbar
        onBackClicked={() => {
          router.back();
        }}
        title={"Create New Blog"}
        buttons={[
          <Button
            key={generateRandomString(30)}
            icon={<RocketLaunchIcon />}
            disabled={disablePublish || isLoading}
            onClick={async () => {
              setIsLoading(true);
              blob.id = params.blogId;
              await uploadBlog(blob, serializeBlobToHTML(blob));
              router.push(`/${blob.id}`);
            }}
          />,
        ]}
      />
      <Workspace
        blob={blob}
        onImageSelected={(file) => {
          return uploadImage(file, blob.id);
        }}
        onSave={async (blob) => {
          setDisabledPublish(
            blob.contents[0].type !== "image" ||
              (blob.contents[0].content as ImageContent).url === "" ||
              blob.contents[2].type !== "text",
          );
          setBlob(blob);
        }}
      />
    </div>
  );
}

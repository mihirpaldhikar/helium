"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/configs/FirebaseConfig";
import {
  deleteBlog,
  getBlog,
  uploadBlog,
  uploadImage,
} from "@/utils/FirebaseUtils";
import { Blob, serializeBlobToHTML } from "@mihirpaldhikar/polaris";
import EditLayout from "@/app/edit/[blogId]/layout";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ImageContent } from "@mihirpaldhikar/polaris/dist/cjs/types/interfaces";
import Navbar from "@/components/Navbar";
import { generateRandomString } from "@/utils/SharedUtils";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Workspace from "@/components/Workspace";
import Button from "@/components/Button";

export default function EditBlog({
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
    getBlog(params.blogId).then(async (data) => {
      if (data !== null) {
        const blobFetchRequest = await fetch(data.blobURI, {
          credentials: "same-origin",
        });
        setBlob(await blobFetchRequest.json());
        setIsEditorLoading(false);
      }
    });
  }, [params.blogId]);

  if (isEditorLoading || isAccountLoading || isLoading) {
    return <CircularProgressBar />;
  }

  if (blob === undefined) {
    return <h2>Error Occurred</h2>;
  }

  return (
    <EditLayout>
      <div className={"flex w-full flex-col space-y-10"}>
        <Navbar
          onBackClicked={() => {
            router.back();
          }}
          title={"Edit"}
          buttons={[
            <Button
              key={generateRandomString(30)}
              icon={<XMarkIcon />}
              type={"danger"}
              onClick={async () => {
                setIsLoading(true);
                await deleteBlog(blob);
                router.push(`/admin`);
              }}
            />,
            <Button
              key={generateRandomString(30)}
              icon={<CloudArrowUpIcon />}
              disabled={disablePublish || isLoading}
              onClick={async () => {
                setIsLoading(true);
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
    </EditLayout>
  );
}

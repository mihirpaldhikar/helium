import { JSX } from "react";
import { getBlog } from "@/utils/FirebaseUtils";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";

export async function generateMetadata(resolver: any): Promise<Metadata> {
  const blogMetaData = await getBlog(resolver["params"]["blogId"]);

  if (blogMetaData === null) {
    return {
      title: "Blog Not Found",
    };
  }
  return {
    title: blogMetaData.title,
  };
}

export default async function BlogViewer({
  params,
}: {
  params: { blogId: string };
}): Promise<JSX.Element> {
  const { blogId } = params;
  const blogMetadata = await getBlog(blogId);

  if (blogMetadata === null) {
    return <div>Blog not found</div>;
  }

  const fetchBlobRequest = await fetch(blogMetadata.htmlURI);
  const blob = (await fetchBlobRequest.text()) as string;

  return (
    <div className={"flex h-screen flex-col"}>
      <Navbar title={blogMetadata.title} />
      <div
        className={"prose mx-auto my-20"}
        dangerouslySetInnerHTML={{ __html: blob }}
      ></div>
      <span className={"invisible h-60"}>&nbsp;</span>
    </div>
  );
}

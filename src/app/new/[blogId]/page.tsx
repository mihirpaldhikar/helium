"use client";
import { Fragment, JSX } from "react";

export default function CreateNewBlog({
  params,
}: {
  params: { blogId: string };
}): JSX.Element {
  return (
    <Fragment>
      <h2>Hello {params.blogId}</h2>
    </Fragment>
  );
}

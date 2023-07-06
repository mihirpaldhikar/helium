import { Fragment, JSX } from "react";

export default async function BlogViewer({
  params,
}: {
  params: { blogId: string };
}): Promise<JSX.Element> {
  return (
    <Fragment>
      <h2>Hello {params.blogId}</h2>
    </Fragment>
  );
}

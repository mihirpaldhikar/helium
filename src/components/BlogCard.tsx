import { JSX } from "react";
import Blog from "@/interfaces/Blog";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
  isAuthenticated?: boolean;
}

export default function BlogCard({
  blog,
  isAuthenticated = false,
}: BlogCardProps): JSX.Element {
  return (
    <Link href={isAuthenticated ? `/edit/${blog.blogId}` : `/${blog.blogId}`}>
      <div
        className={
          "mt-2 flex w-full cursor-pointer flex-col items-center justify-center space-y-5 rounded-xl border-2 bg-white p-3"
        }
      >
        <Image
          priority={true}
          src={blog.heroImage}
          alt={"Hero Image"}
          width={0}
          height={0}
          className={"h-40 w-full rounded-md"}
        />
        <div className={"w-full"}>
          <h4 className={"text-2xl font-bold"}>{blog.title}</h4>
        </div>
      </div>
    </Link>
  );
}

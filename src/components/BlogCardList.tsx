import { JSX } from "react";
import BlogCard from "@/components/BlogCard";
import Blog from "@/interfaces/Blog";

interface BlogCardList {
  blogs: Blog[];
  isAuthenticated?: boolean;
}

export default function BlogCardList({
  blogs,
  isAuthenticated = false,
}: BlogCardList): JSX.Element {
  return blogs.length === 0 ? (
    <div className={"flex h-screen "}>
      <div className={"m-auto"}>
        <h2 className={"text-xl font-bold"}>No Blogs Found!</h2>
      </div>
    </div>
  ) : (
    <div
      className={
        "grid w-full grid-cols-1 gap-3 px-3 py-20 md:grid-cols-4 md:px-10"
      }
    >
      {blogs.map((b) => {
        return (
          <BlogCard key={b.blogId} blog={b} isAuthenticated={isAuthenticated} />
        );
      })}
    </div>
  );
}

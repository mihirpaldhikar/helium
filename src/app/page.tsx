import { getBlogs } from "@/utils/FirebaseUtils";
import Navbar from "@/components/Navbar";
import { Fragment } from "react";
import { generateRandomString } from "@/utils/SharedUtils";
import Link from "next/link";
import BlogCardList from "@/components/BlogCardList";

export const dynamic = "auto",
  revalidate = 60;

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <Fragment>
      <Navbar
        title={"Helium"}
        buttons={[
          <Link key={generateRandomString(30)} href={"/login"}>
            <button
              className={
                "rounded-md bg-blue-600 p-1 px-3 py-1 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-400 hover:disabled:bg-gray-300"
              }
            >
              Login
            </button>
          </Link>,
        ]}
      />
      <BlogCardList blogs={blogs} />
    </Fragment>
  );
}

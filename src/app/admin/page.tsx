"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/configs/FirebaseConfig";
import CircularProgressBar from "@/components/CircularProgressBar";
import Blog from "@/interfaces/Blog";
import { getBlogs, logout } from "@/utils/FirebaseUtils";
import Navbar from "@/components/Navbar";
import { generateRandomString } from "@/utils/SharedUtils";
import { ArrowRightOnRectangleIcon, PlusIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import BlogCardList from "@/components/BlogCardList";

export default function Admin(): JSX.Element {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebaseAuth);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login");
      return;
    }
  }, [loading, router, user]);

  useEffect(() => {
    getBlogs().then((blogs) => {
      setBlogs(blogs);
      setIsMounted(true);
    });
  }, []);

  if (loading || user === undefined || user === null || !isMounted) {
    return <CircularProgressBar />;
  }

  return (
    <div className={"flex h-screen w-full flex-col bg-gray-50"}>
      <Navbar
        title={"Admin"}
        buttons={[
          <Button
            key={generateRandomString(30)}
            icon={<PlusIcon />}
            onClick={() => {
              router.push(`/new/${generateRandomString(50)}`);
            }}
          />,
          <Button
            key={generateRandomString(30)}
            icon={<ArrowRightOnRectangleIcon />}
            type={"tertiary"}
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          />,
        ]}
      />
      <BlogCardList blogs={blogs} isAuthenticated={true} />
    </div>
  );
}

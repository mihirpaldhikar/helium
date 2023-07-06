"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/configs/FirebaseConfig";
import { signIn } from "@/utils/FirebaseUtils";
import LoginLayout from "@/app/login/layout";
import CircularProgressBar from "@/components/CircularProgressBar";
import Input from "@/components/Input";

export default function Login(): JSX.Element {
  const router = useRouter();
  const [user, isAccountLoading, error] = useAuthState(firebaseAuth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAccountLoading && user !== null && user !== undefined) {
      router.push("/admin");
    }
  }, [isAccountLoading, router, user]);

  if (isAccountLoading || user === undefined || user !== null || loading) {
    return <CircularProgressBar />;
  }

  return (
    <LoginLayout>
      <div className={"flex h-screen px-5"}>
        <div
          className={
            "m-auto flex w-full flex-col space-y-3 rounded-md border-2 px-7 pb-5 pt-20 md:w-2/6"
          }
        >
          <div
            className={
              "mb-5 flex w-full items-center justify-center text-center text-3xl font-bold"
            }
          >
            <h2>Login</h2>
          </div>
          <Input
            disabled={loading}
            value={email}
            placeholder={"Email"}
            type={"email"}
            onChange={(value) => {
              setEmail(value);
              setDisabled(value === "" || password === "");
            }}
          />
          <Input
            disabled={loading}
            value={password}
            placeholder={"Password"}
            type={"password"}
            onChange={(value) => {
              setPassword(value);
              setDisabled(value === "" || email === "");
            }}
          />
          <button
            disabled={disabled || loading}
            className={
              "w-full rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-black"
            }
            onClick={() => {
              setLoading(true);
              signIn(email, password).then(() => {
                router.push("/admin");
              });
            }}
          >
            Login
          </button>
        </div>
      </div>
    </LoginLayout>
  );
}

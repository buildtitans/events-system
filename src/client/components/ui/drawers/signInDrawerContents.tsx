"use client";
import SignInCard from "../../sections/forms/auth/SignInCard";
import type { JSX } from "react";
import { useLogin } from "@/src/lib/hooks/auth/authenticate/useLogin";

export default function SignInDrawerContents(): JSX.Element | null {
  const { login } = useLogin();

  return <SignInCard login={login} />;
}

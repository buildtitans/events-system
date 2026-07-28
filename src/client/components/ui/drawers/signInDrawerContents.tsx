"use client";
import SignInCard from "../../sections/forms/auth/SignInCard";
import type { JSX } from "react";
import { useValidateCredentials } from "@/src/lib/hooks/validation/useValidateCredentialsInput";
import { useLogin } from "@/src/lib/hooks/auth/authenticate/useLogin";

export default function SignInDrawerContents(): JSX.Element | null {
  const { handleSubmit, credentials, setCredentials } = useLogin();
  const { isSubmittable, errors, handleEmail, handlePassword } =
    useValidateCredentials({ credentials, setCredentials });

  return (
    <SignInCard
      isSubmittable={isSubmittable}
      errors={errors}
      handleEmail={handleEmail}
      handleSubmit={handleSubmit}
      handlePassword={handlePassword}
    />
  );
}

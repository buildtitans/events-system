"use client";
import SignInCard from "../../sections/forms/auth/SignInCard";
import type { JSX } from "react";
import { useValidateCredentials } from "@/src/lib/hooks/validation/useValidateCredentialsInput";
import { useLogin } from "@/src/lib/hooks/auth/useLogin";
import { useState } from "react";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";

export default function SignInDrawerContents(): JSX.Element | null {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const { handleSubmit, status } = useLogin(credentials);
  const {
    isSubmittable,
    emailErrorMessage,
    emailError,
    passwordError,
    passwordErrorMessage,
    handleEmail,
    handlePassword,
  } = useValidateCredentials(credentials, setCredentials, status);

  return (
    <SignInCard
      isSubmittable={isSubmittable}
      emailErrorMessage={emailErrorMessage}
      emailError={emailError}
      passwordError={passwordError}
      passwordErrorMessage={passwordErrorMessage}
      handleEmail={handleEmail}
      handleSubmit={handleSubmit}
      handlePassword={handlePassword}
    />
  );
}

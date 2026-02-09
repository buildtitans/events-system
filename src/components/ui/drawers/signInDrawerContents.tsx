"use client";
import SignInCard from "../../sections/forms/SignInCard";
import type { JSX } from "react";
import { useValidateCredentials } from "@/src/lib/hooks/validation/useValidateCredentialsInput";
import { useLogin } from "@/src/lib/hooks/auth/useLogin";

export default function SignInDrawerContents(): JSX.Element | null {
    const {
        isSubmittable,
        emailErrorMessage,
        emailError,
        passwordError,
        passwordErrorMessage,
        credentials,
        handleEmail,
        handlePassword,
    } = useValidateCredentials();

    const { handleSubmit } = useLogin(credentials);

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
    )
}
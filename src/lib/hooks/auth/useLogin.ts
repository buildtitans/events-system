"use client"
import { useEffect, useState } from "react"
import { trpcClient } from "@/src/trpc/trpcClient"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess } from "@/src/lib/store/slices/AuthSlice"
import { AppDispatch, RootState } from "@/src/lib/store"
import { LoginCredentials } from "../useValidateCredentialsInput"
import type { UseLoginHook } from "../../types/types"
import { useRouter } from "next/navigation";
import { AuthenticationSchemaType } from "@/src/schemas/loginCredentialsSchema"
import { currentLoginStatus } from "../../store/slices/RenderingSlice"

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const loginStatus = useSelector((s: RootState) => s.rendering.loginStatus);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLoginResult = (result: AuthenticationSchemaType): void => {
        const { success } = result
        dispatch(currentLoginStatus(success ? "success" : "failed"));

        if (success) {
            dispatch(loginSuccess());
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<AuthenticationSchemaType> => {

        const result = await trpcClient
            .auth
            .login
            .mutate({
                email: email,
                password: password
            });
        return result;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {

        e.preventDefault();
        const { email, password } = credentials;
        if ((!email) || (!password)) return;

        dispatch(currentLoginStatus("pending"));
        const result = await login(email, password);
        handleLoginResult(result);

    }


    useEffect(() => {
        if ((userKind === "anonymous") || (loginStatus === "idle")) return;

        if (userKind === "authenticated" && (loginStatus === "success")) {
            router.push("/")
        }

    }, [userKind, loginStatus])


    return {
        loginStatus,
        handleSubmit,
    }
};

export { useLogin }

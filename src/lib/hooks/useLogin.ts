"use client"
import { useEffect, useState } from "react"
import { trpcClient } from "@/src/trpc/trpcClient"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess } from "../store/slices/AuthSlice"
import { AppDispatch, RootState } from "../store"
import { LoginCredentials } from "./useValidateCredentialsInput"
import type { UseLoginHook } from "../types/types"
import { useRouter } from "next/navigation";

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const [loginStatus, setLoginStatus] = useState<UseLoginHook["loginStatus"]>('idle');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLoginResult = (isLoggedIn: boolean): void => {
        setLoginStatus(isLoggedIn ? "success" : "failed");

        if (isLoggedIn) {
            dispatch(loginSuccess());
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<boolean> => {

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

        setLoginStatus('pending');
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
        setLoginStatus
    }
};

export { useLogin }

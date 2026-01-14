"use client"
import { FormEvent, useEffect, useState } from "react"
import { trpcClient } from "@/src/trpc/trpcClient"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../store/slices/AuthSlice"
import { AppDispatch } from "../store"
import { LoginCredentials } from "./useValidateCredentialsInput"
import type { UseLoginHook } from "../types/types"
import { LoginResponse } from "@/src/trpc/types/types"

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const [loginStatus, setLoginStatus] = useState<UseLoginHook["loginStatus"]>('idle');
    const dispatch = useDispatch<AppDispatch>();

    const handleLoginResult = (status: UseLoginHook["loginStatus"]) => {
        if (status === "success") {
            dispatch(loginSuccess())
        } else if (status === "failed") {
            alert("Invalid credentials");
        }
    };


    const login = async (email: string, password: string): Promise<LoginResponse> => {
        const result = await trpcClient
            .auth
            .userByCredentials
            .mutate({
                email: email,
                password: password
            });

        return result;
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        if ((!credentials.email) || (!credentials.password)) return;
        setLoginStatus('pending');
        const result = await login(credentials.email, credentials.password);
        setLoginStatus(result ? 'success' : 'failed');
        handleLoginResult(loginStatus)
    }

    useEffect(() => {
        if (loginStatus === 'success' || loginStatus !== "failed") return;

        const timer = window.setTimeout(() => {
            setLoginStatus('idle');
        }, 2000);

        return () => clearTimeout(timer)
    }, [])


    return { loginStatus, handleSubmit, setLoginStatus }
};

export { useLogin }

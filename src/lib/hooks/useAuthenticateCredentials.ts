"use client"
import { useEffect, useState } from "react"
import { trpcClient } from "@/src/trpc/trpcClient"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../store/slices/AuthSlice"
import { AppDispatch } from "../store"
import { LoginCredentials } from "./useValidateCredentialsInput"


type LoginStatus = 'idle' | 'success' | 'pending' | 'failed';

const useAuthenticateCredentials = (credentials: LoginCredentials) => {
    const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
    const dispatch = useDispatch<AppDispatch>();

    const login = async (email: string, password: string) => {
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
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        const password = credentials.password;
        const email = credentials.email;
        if ((!email) || (!password)) return;
        setLoginStatus('pending');
        const result = await login(email, password);

        if (!result) {
            console.error("Failed to login")
            setLoginStatus("failed");
        } else if (result.id) {
            dispatch(loginSuccess())
            setLoginStatus('success');
        }

    }

    useEffect(() => {
        if (loginStatus === 'idle') return;

        const timer = window.setTimeout(() => {
            setLoginStatus('idle');
        }, 2000);

        return () => clearTimeout(timer)
    }, [])


    return { loginStatus, handleSubmit }
};

export { useAuthenticateCredentials }

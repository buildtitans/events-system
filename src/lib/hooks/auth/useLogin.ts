"use client"
<<<<<<< HEAD
import { useEffect, useState } from "react"
=======
import { useEffect } from "react"
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
import { trpcClient } from "@/src/trpc/trpcClient"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess } from "@/src/lib/store/slices/AuthSlice"
import { AppDispatch, RootState } from "@/src/lib/store"
import { LoginCredentials } from "../useValidateCredentialsInput"
import type { UseLoginHook } from "../../types/types"
import { useRouter } from "next/navigation";
import { AuthenticationSchemaType } from "@/src/schemas/loginCredentialsSchema"
<<<<<<< HEAD
import { currentLoginStatus } from "../../store/slices/RenderingSlice"

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const loginStatus = useSelector((s: RootState) => s.rendering.loginStatus);
=======
import { enqueueSnackbar } from "../../store/slices/RenderingSlice"

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const { status, kind } = useSelector((s: RootState) => s.rendering.snackbar);
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLoginResult = (result: AuthenticationSchemaType): void => {
        const { success } = result
<<<<<<< HEAD
        dispatch(currentLoginStatus(success ? "success" : "failed"));
=======
        dispatch(enqueueSnackbar({ kind: 'login', status: 'success' }));
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

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

<<<<<<< HEAD
        dispatch(currentLoginStatus("pending"));
=======
        dispatch(enqueueSnackbar({ kind: 'login', status: "pending" }));
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
        const result = await login(email, password);
        handleLoginResult(result);

    }


    useEffect(() => {
<<<<<<< HEAD
        if ((userKind === "anonymous") || (loginStatus === "idle")) return;

        if (userKind === "authenticated" && (loginStatus === "success")) {
            router.push("/")
        }

    }, [userKind, loginStatus])


    return {
        loginStatus,
=======
        if ((userKind === "anonymous") || (status === "idle")) return;

        if (userKind === "authenticated" && (status === "success")) {
            router.push("/")
        }

    }, [userKind, status])


    return {
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
        handleSubmit,
    }
};

export { useLogin }

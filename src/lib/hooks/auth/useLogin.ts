"use client";

import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/src/lib/store/slices/AuthSlice";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { LoginCredentials } from "../useValidateCredentialsInput";
import type { UseLoginHook } from "../../types/types";
import { useRouter } from "next/navigation";
import type { AuthenticationSchemaType } from "@/src/schemas/loginCredentialsSchema";
import { enqueueSnackbar } from "../../store/slices/RenderingSlice";

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const { status } = useSelector((s: RootState) => s.rendering.snackbar);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLoginResult = (result: AuthenticationSchemaType): void => {
        const { success } = result;

        dispatch(enqueueSnackbar({ kind: "login", status: success ? "success" : "failed" }));

        if (success) {
            dispatch(loginSuccess());
        }
    };

    const login = async (email: string, password: string): Promise<AuthenticationSchemaType> => {
        const result = await trpcClient.auth.login.mutate({
            email,
            password,
        });
        return result;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const { email, password } = credentials;
        if (!email || !password) return;

        dispatch(enqueueSnackbar({ kind: "login", status: "pending" }));

        const result = await login(email, password);
        handleLoginResult(result);
    };

    useEffect(() => {
        if (userKind === "anonymous" || status === "idle") return;

        if (userKind === "authenticated" && status === "success") {
            router.push("/");
        }
    }, [userKind, status, router]);

    return {
        handleSubmit,
    };
};

export { useLogin };

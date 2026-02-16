"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/src/lib/store/slices/auth/AuthSlice";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { LoginCredentials } from "../../types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";
import type { AuthenticationSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { enqueueDrawer, enqueueSnackbar } from "../../store/slices/rendering/RenderingSlice";
import { syncPermissions } from "../../store/sync/syncPermissions";
import { getViewerPermissions } from "../../store/slices/viewer/PermissionsSlice";

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const { status } = useSelector((s: RootState) => s.rendering.snackbar);

    const dispatch = useDispatch<AppDispatch>();

    const handleLoginResult = async (result: AuthenticationSchemaType): Promise<void> => {
        const { success } = result;

        dispatch(enqueueSnackbar({ kind: "login", status: success ? "success" : "failed" }));

        if (success) {
            dispatch(loginSuccess());
            const permissions = await syncPermissions();

            dispatch(getViewerPermissions(permissions));

            dispatch(enqueueDrawer(null));
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
        await handleLoginResult(result);
    };

    useEffect(() => {
        if (userKind === "anonymous" || status === "idle") return;


    }, [userKind, status]);

    return {
        handleSubmit,
    };
};

export { useLogin };

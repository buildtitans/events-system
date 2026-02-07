"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess, logout } from "../../store/slices/AuthSlice";


const useRecoverSession = (): void => {
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {

        const executeRecoverSession = async () => {

            const result = await trpcClient.auth.recover.mutate();

            if (result) {
                dispatch(loginSuccess())
            } else {
                dispatch(logout())
            }
        }

        executeRecoverSession();

    }, [dispatch]);
};

export { useRecoverSession };
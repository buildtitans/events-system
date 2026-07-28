"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess, logout } from "@/src/lib/store/slices/auth/AuthSlice";
import { storeUserEmail } from "@/src/lib/store/slices/user/userSlice";

const useRecoverSession = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeRecoverSession = async (): Promise<void> => {
      try {
        const result = await trpcClient.auth.status.recover.query();
        if (result) {
          dispatch(loginSuccess());
          dispatch(storeUserEmail({ status: "ready", data: result.email }));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    };

    void executeRecoverSession();
  }, [dispatch]);
};

export { useRecoverSession };

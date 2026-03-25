"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess, logout } from "../../store/slices/auth/AuthSlice";
import { storeUserEmail } from "../../store/slices/user/userSlice";

const useRecoverSession = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeRecoverSession = async () => {
      try {
        const result = await trpcClient.auth.recover.mutate();
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

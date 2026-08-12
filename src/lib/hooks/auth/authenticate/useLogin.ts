"use client";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/src/lib/store/slices/auth/thunks";
import type { AppDispatch } from "@/src/lib/store";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";

const useLogin = (): UseLoginHook => {
  const dispatch = useDispatch<AppDispatch>();

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await dispatch(authenticateUser(credentials));
  };

  return { login };
};

export { useLogin };

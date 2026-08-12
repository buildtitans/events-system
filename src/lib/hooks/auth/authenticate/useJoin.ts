"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { joinAndAuthenticate } from "@/src/lib/store/slices/auth/thunks";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";

export const useSignUp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const signUp = async (credentials: LoginCredentials): Promise<void> => {
    await dispatch(joinAndAuthenticate(credentials)).unwrap();
  };

  return { signUp };
};

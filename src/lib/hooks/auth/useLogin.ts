"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/src/lib/store/slices/auth/AuthSlice";
import type { AppDispatch } from "@/src/lib/store";
import type { LoginCredentials } from "../../types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";

const useLogin = (): UseLoginHook => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>();

  const login = async (email: string, password: string): Promise<void> => {
    await dispatch(authenticateUser({ email, password }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email || !password) return;

    await login(email, password);
  };

  return {
    handleSubmit,
    credentials,
    setCredentials,
  };
};

export { useLogin };

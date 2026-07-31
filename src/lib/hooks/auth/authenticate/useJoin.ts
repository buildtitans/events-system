"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { joinAndAuthenticate } from "@/src/lib/store/slices/auth/thunks";

export const useSignUp = (email: string, password: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await dispatch(joinAndAuthenticate({ email, password })).unwrap();
  };

  return {
    handleSubmit,
  };
};

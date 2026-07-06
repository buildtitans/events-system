"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import React, { useEffect } from "react";
import { hydrateAccountPage } from "@/src/lib/store/slices/user/userSlice";

export default function HydrateUserAccountPage(): React.ReactNode {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeHydrateAccountPage = async () => {
      await dispatch(hydrateAccountPage());
    };

    void executeHydrateAccountPage();
  }, [dispatch]);

  return null;
}

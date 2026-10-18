"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { hydrateUserMemberships } from "@/src/lib/store/slices/user/thunks";

export const useHydrateMemberships = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeHydrateMemberships = async () => {
      await dispatch(hydrateUserMemberships());
    };

    void executeHydrateMemberships();
  }, [dispatch]);
};

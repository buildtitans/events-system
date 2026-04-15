"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import React, { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  getMyGroups,
  storeUserEmail,
} from "@/src/lib/store/slices/user/userSlice";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function HydrateUserAccountPage(): React.ReactNode {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleAccountHydration = (
      email: string,
      myGroups: GroupsSchemaType[],
    ) => {
      dispatch(
        storeUserEmail({
          status: "failed",
          error: "Failed to get user email",
        }),
      );
      dispatch(getMyGroups({ status: "ready", data: myGroups }));
      dispatch(storeUserEmail({ status: "ready", data: email }));
    };

    const executeHydrateAccountPage = async () => {
      dispatch(enqueueSidebar("user"));
      dispatch(storeUserEmail({ status: "pending" }));
      dispatch(getMyGroups({ status: "pending" }));

      try {
        const email = await trpcClient.users.getUserEmail.mutate();
        const myGroups = await trpcClient.users.createdGroups.mutate();
        handleAccountHydration(email, myGroups);
      } catch (err) {
        console.error(err);
        dispatch(
          storeUserEmail({
            status: "failed",
            error: "Failed to get user email",
          }),
        );
        dispatch(
          getMyGroups({
            status: "failed",
            error: "We couldn't load your groups",
          }),
        );
      }
    };

    void executeHydrateAccountPage();
  }, [dispatch]);

  return null;
}

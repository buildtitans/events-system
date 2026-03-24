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
import { wait } from "@/src/lib/utils/rendering/wait";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function HydrateUserAccountPage(): React.ReactNode {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleAccountHydration = (
      email: string,
      myGroups: GroupsSchemaType[],
    ) => {
      dispatch(getMyGroups({ status: "ready", data: myGroups }));
      dispatch(storeUserEmail({ status: "ready", data: email }));
    };

    const executeHydrateAccountPage = async () => {
      dispatch(enqueueSidebar("user"));
      dispatch(storeUserEmail({ status: "pending" }));
      dispatch(getMyGroups({ status: "pending" }));

      await wait(800);

      try {
        const email = await trpcClient.users.getUserEmail.mutate();
        const myGroups = await trpcClient.users.createdGroups.mutate();
        handleAccountHydration(email, myGroups);
      } catch (err) {
        console.error(err);
      }
    };


    void executeHydrateAccountPage();
  }, [dispatch]);

  return null;
}

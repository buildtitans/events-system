"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import React, { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { RBACType } from "@/src/server/src/db/clients/types/types";
import {
  getMyGroups,
  getParticipations,
  storeUserEmail,
} from "@/src/lib/store/slices/user/userSlice";
import { wait } from "@/src/lib/utils/rendering/wait";

export default function HydrateUserAccountPage(): React.ReactNode {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleAccountHydration = (
      email: string,
      myGroups: GroupsSchemaType,
      attendance: AttendanceDictionaryType,
      memberships: RBACType,
    ) => {
      dispatch(storeUserEmail({ status: "ready", data: email }));
      dispatch(
        getParticipations({
          status: "ready",
          data: { rsvps: attendance, memberships: memberships },
        }),
      );
      dispatch(getMyGroups({ status: "ready", data: myGroups }));
    };

    const executeHydrateAccountPage = async () => {
      dispatch(storeUserEmail({ status: "pending" }));
      dispatch(getParticipations({ status: "pending" }));
      dispatch(getMyGroups({ status: "pending" }));

      await wait(800);

      try {
        const email = await trpcClient.users.getUserEmail.mutate();
        const memberships = await trpcClient.users.userMemberships.mutate();
        const attendance = await trpcClient.users.rsvpsToEvents.mutate();
        const myGroups = await trpcClient.users.createdGroups.mutate();

        handleAccountHydration(email, myGroups, attendance, memberships);
      } catch (err) {
        console.error(err);
      }
    };


    void executeHydrateAccountPage();
  }, []);

  return null;
}

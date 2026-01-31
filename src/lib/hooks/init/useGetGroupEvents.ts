"use client"
import { useEffect } from "react";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export const useGetGroupEvents = (group_id: EventSchemaType["group_id"] | null | undefined) => {


    useEffect(() => {
        if (!group_id) return;

        const executeGetGroupEvents = async () => {
            const result = await trpcClient.events.groupEvents.mutate(group_id)
            return result;
        }

        void executeGetGroupEvents();

    }, [group_id]);


    return null;
}
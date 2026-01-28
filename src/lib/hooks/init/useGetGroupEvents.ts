"use client"
import { useEffect } from "react";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export const useGetGroupEvents = (group_id: EventSchemaType["group_id"]) => {

    console.log(group_id);

    useEffect(() => {
        const executeGetGroupEvents = async () => {
            const result = await trpcClient.events.groupEvents.mutate(group_id)
            console.log({
                "Events for Group": result
            });
            return result;
        }

        void executeGetGroupEvents();

    }, [group_id]);


    return null;
}
import { useEffect } from "react";
import { EventSchemaType } from "@/src/schemas/eventSchema";

export const useGetGroupEvents = (group_id: EventSchemaType["group_id"]) => {

    useEffect(() => {
        const executeGetGroupEvents = async () => {

            //TODO: configure endpoint to get events by group_id
        }


    }, [group_id])
}
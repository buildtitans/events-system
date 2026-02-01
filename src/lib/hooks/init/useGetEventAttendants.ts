"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { getEventAttendants } from "../../store/slices/EventAttendantsSlice";

export const useGetEventAttendants = (event_id: EventSchemaType["id"]) => {
    const attendants = useSelector((s: RootState) => s.eventAttendants.attendants);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        const executeGetAttendants = async () => {
            try {
                const res = await trpcClient
                    .eventAttendants
                    .getAttendants
                    .mutate(event_id);

                dispatch(getEventAttendants(res));
            } catch (err) {
                console.error(err);
            }

        };

        void executeGetAttendants();
    }, [event_id, dispatch]);

    return {
        attendants
    };
};
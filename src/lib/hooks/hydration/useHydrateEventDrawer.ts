"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect } from "react";
import { EventAttendantsSchemaType } from "@/src/schemas/eventAttendantsSchema";
import { getViewerAttendance } from "../../store/slices/events/EventDrawerSlice";
import { getEventAttendants } from "../../store/slices/events/EventAttendantsSlice";

function getViewerFromAttendants(
    user_id: string,
    attendants: EventAttendantsSchemaType[]
): EventAttendantsSchemaType | undefined {
    return attendants.find(a => a.user_id === user_id);
};

function ifNotAttendant(
    user_id: string,
    event_id: string
): EventAttendantsSchemaType {
    return {
        user_id: user_id,
        event_id: event_id,
        status: "not_going",
        created_at: new Date().toISOString(),
        updated_at: null
    };
};

export const useHydrateEventDrawer = () => {
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const ViewerAccess = useSelector((s: RootState) => s.groupMembers.accessPermissions[event?.group_id ?? ""]);
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if ((!event)) return;
        if (userKind === "anonymous") return;

        const handleAttendants = (
            attendantsReq: EventAttendantsSchemaType[],
            user_id: string,
            event_id: string

        ) => {
            dispatch(getEventAttendants(attendantsReq));
            const viewerAttendance = getViewerFromAttendants(user_id, attendantsReq);

            dispatch(getViewerAttendance(viewerAttendance ?? ifNotAttendant(user_id, event_id)));
        };

        const executeGetViewerAttendance = async () => {

            try {
                const res = await trpcClient
                    .auth
                    .session
                    .mutate();

                if (!res) {
                    throw new Error(`Failed to get current user`);
                }

                const { user_id } = res;


                if (ViewerAccess === "anonymous") return;
                const attendantsReq = await trpcClient
                    .eventAttendants
                    .getAttendants
                    .mutate(event.id);

                if (!attendantsReq) {
                    throw new Error("Failed to get attendants")
                }
                handleAttendants(attendantsReq, user_id, event.id);

            } catch (err) {
                console.error(err);
            }
        };

        void executeGetViewerAttendance();
    }, [event, ViewerAccess, dispatch, userKind]);

    return;
}
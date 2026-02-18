"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { useEffect } from "react";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { getGroupName, getNumAttendants, getNumInterested, getViewerAttendance } from "../../store/slices/events/EventDrawerSlice";
import { getEventAttendants } from "../../store/slices/events/EventAttendantsSlice";
import { syncUserAttendanceToEvent } from "../../store/sync/syncUserAttendanceToEvent";


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
    const drawerActive = useSelector((s: RootState) => s.rendering.drawer);
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if ((event.status !== "ready")) return;
        if (userKind === "anonymous") return;
        if (drawerActive !== "event drawer") return;

        const handleAttendants = (
            attendantsReq: EventAttendantsSchemaType[],
            user_id: string,
            event_id: string
        ) => {
            dispatch(getEventAttendants(attendantsReq));
            const viewerAttendance = getViewerFromAttendants(user_id, attendantsReq);
            const notYetDecided = ifNotAttendant(user_id, event_id)

            dispatch(getViewerAttendance(viewerAttendance ?? notYetDecided));
        };

        const executeGetViewerAttendance = async () => {

            try {
                const result = await syncUserAttendanceToEvent(event.data);

                const user_id = result.user_id;
                const attendants = result.attendantsReq;

                if (!user_id) return;

                if (!attendants) {
                    dispatch(getNumAttendants({ status: "none" }));

                    throw new Error("Failed to get attendants")
                };

                const group = groups.find((group) => group.id === event.data.group_id)

                const name = group?.name;

                const attending = attendants.filter((el) => el.status === "going");

                const interested = attendants.filter((el) => el.status === "interested");

                if (name) dispatch(getGroupName({ status: "ready", data: name }));

                dispatch(getNumAttendants({ status: "ready", data: attending.length }));

                dispatch(getNumInterested({ status: "ready", data: interested.length }));

                handleAttendants(
                    attendants,
                    user_id,
                    event.data.id
                );

            } catch (err) {
                console.error(err);
            }
        };

        void executeGetViewerAttendance();
    }, [event, dispatch, userKind, drawerActive]);

    return;
}
"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useState } from "react";
import { EventAttendantsSchemaType } from "@/src/schemas/eventAttendantsSchema";
import { getViewerAttendance, setViewerMemberType } from "../../store/slices/events/EventDrawerSlice";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

function getViewerFromAttendants(user_id: string, attendants: EventAttendantsSchemaType[]): EventAttendantsSchemaType | undefined {

    const info = attendants.find((attendant: EventAttendantsSchemaType) => {
        const match = (attendant.user_id === user_id);
        if (match) {
            return attendant
        }
    });

    return info
};

function ifNotAttendant(user_id: string, event_id: string): EventAttendantsSchemaType {

    const now = String(new Date())

    return {
        user_id: user_id,
        event_id: event_id,
        status: "not_going",
        created_at: now,
        updated_at: null

    }
};

function isMemberOfThisGroup(user_id: string, members: GroupMembersSchemaType[]): boolean {
    let isMember: boolean = false;

    members.forEach((member) => {
        if (user_id === member.user_id) {
            isMember = true;
            return;
        }
    })
    return isMember
}


export const usePreloadAttendance = () => {
    const members = useSelector((s: RootState) => s.groupMembers.members);
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const attendants = useSelector((s: RootState) => s.eventAttendants.attendants);
    const viewerType = useSelector((s: RootState) => s.eventDrawer.viewerType);
    const dispatch = useDispatch<AppDispatch>();

    console.log(viewerType)

    useEffect(() => {
        if (!event) return;

        const executeGetViewerAttendance = async () => {
            try {
                const res = await trpcClient.auth.session.mutate();

                if (!res) {
                    throw new Error(`Failed to get current user`);
                }

                const { user_id } = res;

                const isGroupMember = isMemberOfThisGroup(user_id, members);

                dispatch(setViewerMemberType(isGroupMember ? "member" : "anonymous"))

                const attendance = getViewerFromAttendants(user_id, attendants);
                console.log(attendance)

                dispatch(getViewerAttendance(attendance ?? ifNotAttendant(user_id, event.id)))

            } catch (err) {
                console.error(err);
            }

        };

        void executeGetViewerAttendance();


    }, [event])
}
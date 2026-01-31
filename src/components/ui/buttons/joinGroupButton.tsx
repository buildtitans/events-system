"use client"
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { JSX } from "react";
import { useJoinGroup } from "@/src/lib/hooks/insert/useJoinGroup";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type JoinGroupButtonProps = {
    group_id: GroupSchemaType["id"] | null | undefined,
    members: GroupMembersSchemaType[]
}

export default function JoinGroupButton({ group_id, members }: JoinGroupButtonProps): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const { handleClick } = useJoinGroup();


    if (userKind === "anonymous" || (!group_id)) return null;

    return (
        <Button
            onClick={() => handleClick(group_id)}
            variant="contained"
            startIcon={<AddIcon />}
        >
            Join
        </Button>
    );
};
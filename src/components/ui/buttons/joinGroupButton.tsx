"use client"
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { useMemo, type JSX } from "react";
import { useJoinGroup } from "@/src/lib/hooks/insert/useJoinGroup";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { LoadingStatus } from "@/src/lib/types/tokens/types";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type JoinGroupButtonProps = {
    group_id: GroupSchemaType["id"],
    status: LoadingStatus,
    viewerAccess: GroupMembersSchemaType["role"]
}

export default function JoinGroupButton({ group_id, status, viewerAccess }: JoinGroupButtonProps): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    console.log(viewerAccess)
    const { handleClick } = useJoinGroup();

    if ((userKind === "authenticated") && (viewerAccess === "anonymous")) {
        return (
            <Button
                onClick={() => handleClick(group_id)}
                variant="contained"
                startIcon={<AddIcon />}
                size="medium"
                sx={{ width: '100px', borderRadius: 999 }}
            >
                Join
            </Button>
        );
    }

    return null;

};
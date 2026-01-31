"use client"
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { JSX } from "react";
import { useJoinGroup } from "@/src/lib/hooks/insert/useJoinGroup";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";

export default function JoinGroup({ group_id }: { group_id: GroupSchemaType["id"] }): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const { handleClick } = useJoinGroup();

    if (userKind === "anonymous") return null;

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
"use client"
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { type JSX } from "react";
import { useJoinGroup } from "@/src/lib/hooks/insert/useJoinGroup";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

type JoinGroupButtonProps = {
    group_id: GroupSchemaType["id"],
}

export default function JoinGroupButton({
    group_id,
}: JoinGroupButtonProps): JSX.Element | null {
    const { handleClick } = useJoinGroup();

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
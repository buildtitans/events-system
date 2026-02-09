"use client";
import type { CreateNewGroupHook } from "@/src/lib/hooks/insert/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupNameFieldProps = {
    handleGroupName: CreateNewGroupHook["handleGroupName"],
    width: string
}

export default function GroupNameField({
    handleGroupName,
    width
}: GroupNameFieldProps): JSX.Element {

    return (
        <TextField
            sx={{
                width: width
            }}
            onChange={(e) => handleGroupName(e)}
            id="group-name"
            label="Group Name"
            variant="outlined"
        />

    )
};
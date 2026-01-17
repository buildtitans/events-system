"use client";
import { CreateNewGroupHook } from "@/src/lib/hooks/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupNameFieldProps = {
    handleGroupName: CreateNewGroupHook["handleGroupName"]
}

export default function GroupNameField({
    handleGroupName
}: GroupNameFieldProps): JSX.Element {

    return (
        <>
            <TextField
                onChange={(e) => handleGroupName(e)}
                id="group-name"
                label="Group Name"
                variant="outlined"
            />
        </>

    )
};
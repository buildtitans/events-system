"use client";
import { CreateNewGroupHook } from "@/src/lib/hooks/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupNameFieldProps = {
    handleGroupDescription: CreateNewGroupHook["handleGroupDescription"]
}

export default function GroupDescriptionField({
    handleGroupDescription
}: GroupNameFieldProps): JSX.Element {

    return (
        <>
            <TextField
                onChange={(e) => handleGroupDescription(e)}
                id="group-description"
                label="Group Description"
                variant="outlined"
            />
        </>

    )
};
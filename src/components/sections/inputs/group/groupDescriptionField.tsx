"use client";
import type { CreateNewGroupHook } from "@/src/lib/hooks/insert/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupNameFieldProps = {
    handleGroupDescription: CreateNewGroupHook["handleGroupDescription"],
    width: string
}

export default function GroupDescriptionField({
    handleGroupDescription,
    width
}: GroupNameFieldProps): JSX.Element {

    return (
        <>
            <TextField
                onChange={(e) => handleGroupDescription(e)}
                id="group-description"
                label="Group Description"
                variant="outlined"
                sx={{
                    width: width
                }}
            />
        </>

    )
};
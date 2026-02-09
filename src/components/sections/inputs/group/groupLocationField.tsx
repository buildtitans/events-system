"use client";
import type { CreateNewGroupHook } from "@/src/lib/hooks/insert/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupLocationFieldProps = {
    handleGroupLocation: CreateNewGroupHook["handleGroupLocation"],
    width: string
}

export default function GroupLocationField({ handleGroupLocation, width }: GroupLocationFieldProps): JSX.Element {


    return (
        <>
            <TextField
                onChange={(e) => handleGroupLocation(e)}
                id="group-location"
                label="Location"
                variant="outlined"
                sx={{
                    width: width
                }}
            />
        </>

    )
}
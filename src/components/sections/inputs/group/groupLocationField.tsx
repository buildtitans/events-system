"use client";
import { CreateNewGroupHook } from "@/src/lib/hooks/useCreateNewGroup";
import TextField from "@mui/material/TextField";
import { JSX } from "react";

type GroupLocationFieldProps = {
    handleGroupLocation: CreateNewGroupHook["handleGroupLocation"]
}

export default function GroupLocationField({ handleGroupLocation }: GroupLocationFieldProps): JSX.Element {


    return (
        <>
            <TextField
                onChange={(e) => handleGroupLocation(e)}
                id="group-location"
                label="Location"
                variant="outlined"
            />
        </>

    )
}
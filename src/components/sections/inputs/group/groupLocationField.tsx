"use client";
import type { CreateNewGroupHook } from "@/src/lib/hooks/insert/useCreateNewGroup";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { JSX } from "react";
import {
    createGroupFieldControlSx,
    createGroupTextFieldSx,
} from "@/src/styles/sx/createGroupDrawer";

type GroupLocationFieldProps = {
    handleGroupLocation: CreateNewGroupHook["handleGroupLocation"],
}

export default function GroupLocationField({ handleGroupLocation }: GroupLocationFieldProps): JSX.Element {


    return (
        <FormControl fullWidth sx={createGroupFieldControlSx}>
            <TextField
                onChange={(e) => handleGroupLocation(e)}
                id="group-location"
                label="Location"
                variant="outlined"
                fullWidth
                sx={createGroupTextFieldSx}
            />
        </FormControl>

    )
}

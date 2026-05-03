"use client";
import type { CreateNewGroupHook } from "@/src/lib/types/hooks/types";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { JSX } from "react";
import {
    createGroupFieldControlSx,
    createGroupTextFieldSx,
} from "@/src/styles/sx/createGroupDrawer";

type GroupNameFieldProps = {
    getInput: CreateNewGroupHook["getInput"],
}

export default function GroupNameField({
    getInput,
}: GroupNameFieldProps): JSX.Element {

    return (
        <FormControl fullWidth sx={createGroupFieldControlSx}>
            <TextField
                onChange={(e) => getInput(e, "name")}
                id="group-name"
                label="Group Name"
                variant="outlined"
                fullWidth
                sx={createGroupTextFieldSx}
            />
        </FormControl>

    )
};

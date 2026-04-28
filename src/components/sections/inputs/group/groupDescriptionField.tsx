"use client";
import type { CreateNewGroupHook } from "@/src/lib/hooks/insert/useCreateNewGroup";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { JSX } from "react";
import {
    createGroupFieldControlSx,
    createGroupTextFieldSx,
} from "@/src/styles/sx/createGroupDrawer";

type GroupNameFieldProps = {
    handleGroupDescription: CreateNewGroupHook["handleGroupDescription"],
}

export default function GroupDescriptionField({
    handleGroupDescription,
}: GroupNameFieldProps): JSX.Element {

    return (
        <FormControl fullWidth sx={createGroupFieldControlSx}>
            <TextField
                onChange={(e) => handleGroupDescription(e)}
                id="group-description"
                label="Group Description"
                variant="outlined"
                fullWidth
                sx={createGroupTextFieldSx}
            />
        </FormControl>

    )
};

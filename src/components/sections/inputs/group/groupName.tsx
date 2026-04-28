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
    handleGroupName: CreateNewGroupHook["handleGroupName"],
}

export default function GroupNameField({
    handleGroupName,
}: GroupNameFieldProps): JSX.Element {

    return (
        <FormControl fullWidth sx={createGroupFieldControlSx}>
            <TextField
                onChange={(e) => handleGroupName(e)}
                id="group-name"
                label="Group Name"
                variant="outlined"
                fullWidth
                sx={createGroupTextFieldSx}
            />
        </FormControl>

    )
};

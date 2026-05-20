"use client";
import { JSX } from "react";
import SelectCategory from "@/src/client/components/sections/inputs/group/selectCategory";
import { NewGroupInputType } from "@/src/lib/types/hooks/types";
import { useCreateNewGroup } from "@/src/lib/hooks/insert/useCreateNewGroup";
import GroupNameField from "@/src/client/components/sections/inputs/group/groupName";
import GroupDescriptionField from "@/src/client/components/sections/inputs/group/groupDescriptionField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreateGroupDrawerShell from "@/src/client/components/ui/drawers/createGroupDrawerShell";
import {
    createGroupDrawerFormSx,
    createGroupPrimaryButtonSx,
} from "@/src/client/styles/sx/createGroupDrawer";
import { useForm } from 'react-hook-form';
import GroupLocationField from "@/src/client/components/sections/inputs/group/groupLocationField";

export default function CreateNewGroupForm(): JSX.Element {
    const {control } = useForm<NewGroupInputType>();
    const {
        handleGroupCategory,
        getInput,
        submitNewGroup,
        handleLocation,
        isSubmittable,
        newGroup,
    } = useCreateNewGroup();


    return (
        <CreateGroupDrawerShell>
        <Box sx={createGroupDrawerFormSx}>
            <GroupNameField
                getInput={getInput} />
            <GroupDescriptionField
                getInput={getInput} />
            <GroupLocationField
            control={control}
            handleLocation={handleLocation}
            />
            <SelectCategory
                handleGroupCategory={handleGroupCategory}
                chosen={newGroup.category_id}
            />
            <Button
                variant="contained"
                fullWidth
                sx={createGroupPrimaryButtonSx}
                disabled={!isSubmittable}
                type="button"
                onClick={submitNewGroup}
            >
                Create Group
            </Button>
        </Box>
        </CreateGroupDrawerShell>
    );
}

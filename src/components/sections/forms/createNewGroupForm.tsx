"use client";
import { JSX } from "react";
import SelectCategory from "../inputs/group/selectCategory";
import { NewGroupInputType, useCreateNewGroup } from "@/src/lib/hooks/insert/useCreateNewGroup";
import GroupNameField from "../inputs/group/groupName";
import GroupDescriptionField from "../inputs/group/groupDescriptionField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreateGroupDrawerShell from "@/src/components/ui/drawers/createGroupDrawerShell";
import {
    createGroupDrawerFormSx,
    createGroupPrimaryButtonSx,
} from "@/src/styles/sx/createGroupDrawer";
import { useForm } from 'react-hook-form';
import GroupLocation from "../inputs/group/groupLocation";

export default function CreateNewGroupForm(): JSX.Element {
    const {control } = useForm<NewGroupInputType>();
    const {
        handleGroupCategory,
        handleGroupDescription,
        handleGroupName,
        submitNewGroup,
        handleLocation,
        isSubmittable,
        newGroup,
    } = useCreateNewGroup();


    return (
        <CreateGroupDrawerShell>
        <Box sx={createGroupDrawerFormSx}>
            <GroupNameField
                handleGroupName={handleGroupName} />
            <GroupDescriptionField
                handleGroupDescription={handleGroupDescription} />
            <GroupLocation 
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

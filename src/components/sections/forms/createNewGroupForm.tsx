"use client";
import { JSX } from "react";
import SelectCategory from "../inputs/group/selectCategory";
import { useCreateNewGroup } from "@/src/lib/hooks/insert/useCreateNewGroup";
import GroupNameField from "../inputs/group/groupName";
import GroupLocationField from "../inputs/group/groupLocationField";
import GroupDescriptionField from "../inputs/group/groupDescriptionField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreateGroupDrawerShell from "@/src/components/ui/drawers/createGroupDrawerShell";
import {
    createGroupDrawerFormSx,
    createGroupPrimaryButtonSx,
} from "@/src/styles/sx/createGroupDrawer";

export default function CreateNewGroupForm(): JSX.Element {
    const {
        handleGroupCategory,
        handleGroupDescription,
        handleGroupLocation,
        handleGroupName,
        submitNewGroup,
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
            <GroupLocationField
                handleGroupLocation={handleGroupLocation} />
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

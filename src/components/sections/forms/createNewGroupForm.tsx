"use client";
import { JSX } from "react";
import SelectCategory from "../inputs/group/selectCategory";
import { useCreateNewGroup } from "@/src/lib/hooks/insert/useCreateNewGroup";
import GroupNameField from "../inputs/group/groupName";
import GroupLocationField from "../inputs/group/groupLocationField";
import GroupDescriptionField from "../inputs/group/groupDescriptionField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


const style = {
    position: "relative",
    width: '100%',
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyConent: "start",
    alignItems: "center",
    gap: 4,
    paddingTop: 4
};

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
    const FORM_FIELD_WIDTH = "80%"


    return (
        <Box sx={{ ...style }}>
            <Typography
                component={"h2"}
                sx={{
                    color: 'white',
                    width: FORM_FIELD_WIDTH,
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'light'
                }}
            >
                Establish a New Group
            </Typography>
            <GroupNameField
                width={FORM_FIELD_WIDTH}
                handleGroupName={handleGroupName} />
            <GroupDescriptionField
                width={FORM_FIELD_WIDTH}
                handleGroupDescription={handleGroupDescription} />
            <GroupLocationField
                width={FORM_FIELD_WIDTH}
                handleGroupLocation={handleGroupLocation} />
            <SelectCategory
                width={FORM_FIELD_WIDTH}
                handleGroupCategory={handleGroupCategory}
                chosen={newGroup.category_id}
            />
            <Button
                variant="contained"
                sx={{
                    height: "auto",
                    width: FORM_FIELD_WIDTH,
                }}
                disabled={!isSubmittable}
                type="button"
                onClick={submitNewGroup}
            >
                Create Group
            </Button>
        </Box>
    );
}

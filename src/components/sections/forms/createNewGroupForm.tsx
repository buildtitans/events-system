"use client";
import type { ModalProps } from "@mui/material/Modal";
import Modal from "@mui/material/Modal";
import { JSX } from "react";
import SelectCategory from "../inputs/group/selectCategory";
import { useCreateNewGroup } from "@/src/lib/hooks/useCreateNewGroup";
import GroupNameField from "../inputs/group/groupName";
import GroupLocationField from "../inputs/group/groupLocationField";
import GroupDescriptionField from "../inputs/group/groupDescriptionField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type CreateNewGroupModalProps = {
    open: boolean;
    handleClose: ModalProps["onClose"];
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 4,
};

export default function CreateNewGroupModal({
    open,
    handleClose,
}: CreateNewGroupModalProps): JSX.Element {
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
        <Modal onClose={handleClose} open={open}>
            <Box sx={{ ...style }}>
                <GroupNameField handleGroupName={handleGroupName} />
                <GroupDescriptionField handleGroupDescription={handleGroupDescription} />
                <GroupLocationField handleGroupLocation={handleGroupLocation} />
                <SelectCategory
                    handleGroupCategory={handleGroupCategory}
                    chosen={newGroup.category_id}
                />
                <Button
                    sx={{
                        height: "auto",
                        width: "auto",
                        padding: "12px",
                        bgcolor: "transparent",
                        color: "text.primary",
                    }}
                    disabled={!isSubmittable}
                    type="button"
                    onClick={submitNewGroup}
                >
                    Create Group
                </Button>
            </Box>
        </Modal>
    );
}

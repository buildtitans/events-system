"use client";
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import Modal from "@mui/material/Modal";
import { JSX } from "react";
import SelectCategory from "../inputs/group/selectCategory";
import { useCreateNewGroup } from "@/src/lib/hooks/useCreateNewGroup";
import GroupNameField from "../inputs/group/groupName";
import GroupLocationField from "../inputs/group/groupLocationField";
import GroupDescriptionField from "../inputs/group/groupDescriptionField";
const MotionModal = motion(Modal);

type CreateNewGroupModalProps = {
    open: boolean,
    handleClose: any
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CreateNewGroupModal({
    open,
    handleClose
}: CreateNewGroupModalProps): JSX.Element {
    const {
        handleGroupCategory,
        handleGroupDescription,
        handleGroupLocation,
        handleGroupName,
        isSubmittable,
        newGroup,
    } = useCreateNewGroup();





    return (
        <MotionModal
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            open={open}
            onClose={handleClose}
            sx={{ ...style }}
        >
            <GroupNameField handleGroupName={handleGroupName} />
            <GroupDescriptionField handleGroupDescription={handleGroupDescription} />
            <GroupLocationField handleGroupLocation={handleGroupLocation} />
            <SelectCategory handleGroupCategory={handleGroupCategory} />

        </MotionModal>
    )
}
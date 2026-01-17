"use client"
import { JSX } from "react";
import CreateNewGroupModal from "../../sections/forms/createNewGroupForm";
import { showModal, type ActiveModal } from "@/src/lib/store/slices/RenderingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { ModalProps } from "@mui/material/Modal";


export const modalPipeline = (activeModal: ActiveModal): JSX.Element | null => {
    const dispatch = useDispatch<AppDispatch>();

    const handleClose: ModalProps["onClose"] = () => {
        dispatch(showModal(null));
    };

    switch (activeModal) {
        case "new group":
            return (
                <CreateNewGroupModal key={activeModal} open={activeModal === "new group"} handleClose={handleClose} />
            )

        case null:
            return null;
        default: {
            return null;
        }
    }
}
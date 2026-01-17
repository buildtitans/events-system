"use client"
import { JSX } from "react";
import CreateNewGroupModal from "../../sections/forms/createNewGroupForm";
<<<<<<< HEAD
import type { ActiveModal } from "@/src/lib/store/slices/RenderingSlice";


export const modalPipeline = (activeModal: ActiveModal): JSX.Element | null => {
=======
import { showModal, type ActiveModal } from "@/src/lib/store/slices/RenderingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { ModalProps } from "@mui/material/Modal";


export const modalPipeline = (activeModal: ActiveModal): JSX.Element | null => {
    const dispatch = useDispatch<AppDispatch>();

    const handleClose: ModalProps["onClose"] = () => {
        dispatch(showModal(null));
    };
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)


    switch (activeModal) {
        case "new group":
            return (
<<<<<<< HEAD
                <CreateNewGroupModal open={activeModal === "new group"} handleClose={() => { console.log('closing') }} />
=======
                <CreateNewGroupModal key={activeModal} open={activeModal === "new group"} handleClose={handleClose} />
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
            )

        case null:
            return null;
        default: {
            return null;
        }
    }
}
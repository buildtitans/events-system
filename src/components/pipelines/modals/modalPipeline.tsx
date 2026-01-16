"use client"
import { JSX } from "react";
import CreateNewGroupModal from "../../sections/forms/createNewGroupForm";
import type { ActiveModal } from "@/src/lib/store/slices/RenderingSlice";


export const modalPipeline = (activeModal: ActiveModal): JSX.Element | null => {


    switch (activeModal) {
        case "new group":
            return (
                <CreateNewGroupModal open={activeModal === "new group"} handleClose={() => { console.log('closing') }} />
            )

        case null:
            return null;
        default: {
            return null;
        }
    }
}
"use client"
import Box from "@mui/material/Box";
<<<<<<< HEAD
import { AnimatePresence } from "framer-motion";
=======
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
import { JSX } from "react";
import { modalPipeline } from "../pipelines/modals/modalPipeline";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

<<<<<<< HEAD
export default function ModalLayer(): JSX.Element {
    const activeModal = useSelector((s: RootState) => s.rendering.modal);


    return (
        <Box sx={{
            zIndex: 800
        }}>

            <AnimatePresence>
                {modalPipeline(activeModal)}
            </AnimatePresence>
        </Box>
=======
export default function ModalLayer(): JSX.Element | null {
    const activeModal = useSelector((s: RootState) => s.rendering.modal);
    if (!activeModal) return null;

    return (
        <>
            {modalPipeline(activeModal)}
        </>
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
    )
}
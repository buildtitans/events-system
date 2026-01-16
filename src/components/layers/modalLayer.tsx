"use client"
import Box from "@mui/material/Box";
import { AnimatePresence } from "framer-motion";
import { JSX } from "react";
import { modalPipeline } from "../pipelines/modals/modalPipeline";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

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
    )
}
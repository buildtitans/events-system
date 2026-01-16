"use client"
import Box from "@mui/material/Box";
import { AnimatePresence } from "framer-motion";
import { JSX } from "react";
import { modalPipeline } from "../pipelines/modals/modalPipeline";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import AuthenticatonSnackbar from "../ui/feedback/pending/authenticationSnackbar";
import { changeNewGroupStatus } from "@/src/lib/store/slices/RenderingSlice";


export default function ModalLayer(): JSX.Element {
    const activeModal = useSelector((s: RootState) => s.rendering.modal);
    const newGroupStatus = useSelector((s: RootState) => s.rendering.newGroupStatus);

    return (
        <Box sx={{
            zIndex: 800
        }}>
            <AnimatePresence mode="wait">
                {newGroupStatus !== "idle" && <AuthenticatonSnackbar action={changeNewGroupStatus} status={newGroupStatus} statusKind="newGroup" />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {modalPipeline(activeModal)}
            </AnimatePresence>
        </Box>
    )
}
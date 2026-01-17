"use client"
import { AnimatePresence } from "framer-motion";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { snackbarPipeline } from "../pipelines/snackbars/snackbarPipeline";

export default function SnackbarLayer(): JSX.Element | null {
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    if (!snackbar.kind) return null;

    return (
        <>
            <AnimatePresence mode="wait">
                {snackbarPipeline(snackbar.kind, snackbar.status)}
            </AnimatePresence>
        </>

    )
}
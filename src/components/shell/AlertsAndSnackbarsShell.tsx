"use client";
import { snackbarPipeline } from "../pipelines/snackbars/snackbarPipeline";
import { alertsPipeline } from "../pipelines/alerts/alertsPipeline";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { JSX } from "react";

export default function AlertsAndSnackbarsShell(): JSX.Element | null {
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const alert = useSelector((s: RootState) => s.rendering.alert);

    return (
        <AnimatePresence mode="wait">
            {(alert.action !== null) && alertsPipeline(alert)}
            {snackbarPipeline(snackbar.kind, snackbar.status)}

        </AnimatePresence>
    )
}
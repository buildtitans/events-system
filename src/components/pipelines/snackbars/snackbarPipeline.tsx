"use client"
import { JSX } from "react";
import AuthenticatonSnackbar from "../../ui/feedback/pending/authenticationSnackbar";
import { SnackbarStatusAndKind } from "@/src/lib/store/slices/RenderingSlice";

function snackbarPipeline(kind: SnackbarStatusAndKind["kind"], status: SnackbarStatusAndKind["status"]): JSX.Element | null {

    switch (kind) {
        case null:
            return null
        default: {
            return (
                <AuthenticatonSnackbar key={"snackbar"} statusKind={kind} status={status} />
            )
        }
    }
}


export { snackbarPipeline };
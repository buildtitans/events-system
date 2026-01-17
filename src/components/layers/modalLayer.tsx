"use client"
import { JSX } from "react";
import { modalPipeline } from "../pipelines/modals/modalPipeline";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function ModalLayer(): JSX.Element | null {
    const activeModal = useSelector((s: RootState) => s.rendering.modal);
    if (!activeModal) return null;

    return (
        <>
            {modalPipeline(activeModal)}
        </>
    )
}
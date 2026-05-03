"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import ConfirmModal from "../ui/modals/confirmModal";
import { JSX } from "react";

export default function ModalHost(): JSX.Element | null {
const activeModal = useSelector((s: RootState) => s.rendering.modal);

    return (
        <ConfirmModal activeModal={activeModal} />
    )

}
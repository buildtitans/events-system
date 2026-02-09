"use client";
import type { JSX } from "react";
import type { ActiveDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import SignInDrawerContents from "../../ui/drawers/signInDrawerContents";
import NewEventDrawerContents from "../../ui/containers/NewEventDrawerContents";
import RenderEventDrawerContents from "./renderEventDrawer";

export const OpenedDrawerContents = ({ drawerType }: { drawerType: ActiveDrawer }): JSX.Element | null => {

    console.log(drawerType);

    switch (drawerType) {
        case "create event drawer":
            return (
                <NewEventDrawerContents />
            );

        case "sign in drawer":
            return (
                <SignInDrawerContents />
            );

        case "event drawer":
            return (
                <RenderEventDrawerContents />
            )


        default: {
            return null;
        }
    }
}
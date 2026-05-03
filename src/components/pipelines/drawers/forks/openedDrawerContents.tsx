"use client";
import type { JSX } from "react";
import type { ActiveDrawer } from "@/src/lib/store/slices/rendering/types";
import SignInDrawerContents from "@/src/components/ui/drawers/signInDrawerContents";
import OpenedEventDrawerPipeline from "../interfaces/openedEventDrawerPipeline";
import NewEventDrawerContents from "@/src/components/ui/containers/NewEventDrawerContents";
import CreateNewGroupForm from "@/src/components/sections/forms/group/createNewGroupForm";
import Spinner from "@/src/components/ui/feedback/pending/spinner";
import SignUpCard from "@/src/components/sections/forms/auth/signUpCard";

export const OpenedDrawerContents = ({ drawerType }: { drawerType: ActiveDrawer }): JSX.Element | null => {


    switch (drawerType) {
        case "create event drawer":
            return (
                <NewEventDrawerContents />
            );

        case "sign in drawer":
            return (
                <SignInDrawerContents />
            );


        case "sign up drawer": {
            return (
                <SignUpCard />
            )
        }
            
        case "event drawer":
            return (
                <OpenedEventDrawerPipeline />
            )

        case "new group":
            return (
                <CreateNewGroupForm />
            )


        default: {
            return (
                <Spinner />
            )
        }
    }
}
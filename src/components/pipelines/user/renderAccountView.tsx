"use client";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import MyGroups from "@/src/components/sections/user/myGroups";


export default function RenderAccountView() {
const view = useSelector((s: RootState) => s.user.view);

    switch(view) {

        case "memberships":
        case "rsvps":
        case "settings":
        case "my groups": {
            return (
                <MyGroups />
            )
        }
        
        default: {
            <MyGroups />
        }
    }

}
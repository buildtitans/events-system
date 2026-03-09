"use client"
import type { JSX } from "react";
import type { GroupHistoryType } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import Calandar from "../../ui/dates/calandar";

type RenderGroupCalandarProps = {
    history: GroupHistoryType
}

export const RenderGroupCalandar = ({history}: RenderGroupCalandarProps) => {


    switch(history.status) {

        case "ready": {
            return (
                <Calandar history={history.data} />
            )
        }

        case "initial":
        case "pending":
        case "failed":
    }
}
"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import FadeInOutBox from "@/src/components/ui/box/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { AnimatePresence } from "framer-motion";
import { EventsPages } from "@/src/lib/store/slices/EventsSlice";
import GroupEventsHeader from "./groupEventsHeader";

type GroupHeadSectionProps = {
    status: LoadingStatus,
    pages: EventsPages,
    groupName: GroupSchemaType["name"]
}


export default function GroupHeadSecton(
    {
        status,
        pages,
        groupName
    }: GroupHeadSectionProps): JSX.Element | null {


    return (
        <AnimatePresence>
            {((status === "idle") && (pages.length > 0)) && <FadeInOutBox styles={{ width: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    gap: 6,
                    width: 'auto',
                    height: '100%'
                }}>


                    <GroupEventsHeader
                        groupName={groupName}
                    />

                </Box>

            </FadeInOutBox>
            }
        </AnimatePresence>




    )
}
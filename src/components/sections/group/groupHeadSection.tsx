"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import FadeInOutBox from "@/src/components/ui/box/motionboxes/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { AnimatePresence } from "framer-motion";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import GroupEventsHeader from "./groupEventsHeader";

type GroupHeadSectionProps = {
    pages: EventsPages,
    groupName: GroupSchemaType["name"]
}

export default function GroupHeadSecton(
    {
        pages,
        groupName
    }: GroupHeadSectionProps): JSX.Element | null {


    return (
        <AnimatePresence>
            {((pages.length > 0)) && <FadeInOutBox styles={{ width: '100%' }}>
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
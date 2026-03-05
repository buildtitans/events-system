"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import FadeInOutBox from "@/src/components/ui/box/motionboxes/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { AnimatePresence } from "framer-motion";
import GroupEventsHeader from "./groupEventsHeader";

type GroupHeadSectionProps = {
    groupName: GroupSchemaType["name"]
}

export default function GroupHeadSecton(
    {
        groupName
    }: GroupHeadSectionProps): JSX.Element | null {


    return (
        <AnimatePresence>
            {(groupName) && <FadeInOutBox styles={{ width: '100%', height: 'auto' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: "start",
                    gap: 4,
                    width: 'auto',
                    height: 'auto',
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
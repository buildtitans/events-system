"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import EventsLayout from "../../sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const RenderEventsForGroup = () => {
    const events = useSelector((s: RootState) => s.openGroup.events);
    const page = useSelector((s: RootState) => s.openGroup.currPage);


    if ((events.status === "pending") || (events.status === "refreshing")) {

        return (<LinearIndeterminate />)
    }

    if (events.status === "ready") {
        return (
            <React.Fragment>
            <Box>
                <Typography component={"h2"} sx={{ fontSize: "26px", fontWeight: "light"}} >
                    Events
                </Typography>
            </Box>
            <EventsLayout eventsPages={events.data} currentPage={page} />
            </React.Fragment>
        )
    }
}
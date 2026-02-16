"use client";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FadeInOutBox from "../box/motionboxes/fadeInOutBox";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { formatDateForUI } from "@/src/lib/utils/rendering/formatDateForUI";
import OpenedEventImage from "../box/cards/openedEventImage";
import { NumberOfAttendantsType } from "@/src/lib/store/slices/events/EventDrawerSlice";

const stackProps = {
    marginX: 3,
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: "start",
    borderBottom: 1,
    borderColor: 'rgb(255, 255, 255, 0.15)'
}


export default function OpenedEvent({ event, numAttendants }: { event: EventSchemaType, numAttendants?: NumberOfAttendantsType }): JSX.Element {
    const thumbnail = event.img;
    const startTime = formatDateForUI(event.starts_at);

    return (
        <FadeInOutBox>
            <Stack sx={stackProps} spacing={1}>
                <Typography component={"h1"} sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: "28px",
                    fontWeight: "light"
                }} >
                    Event
                </Typography>

                <EventTitle
                    title={event.title}
                />

                <OpenedEventImage
                    thumbnail={thumbnail}
                />

                <EventDescription
                    description={event.description}
                />

                <StartTime
                    startTime={startTime}
                />

                {(numAttendants) && <EventAttendants numAttendants={numAttendants} />}

            </Stack>

        </FadeInOutBox>
    )
}


function EventAttendants({ numAttendants }: { numAttendants: NumberOfAttendantsType }) {

    return (
        <Box
            sx={{
                width: "90%",
                height: "auto",
                textAlign: "left",
                color: "white",
                paddingY: 2
            }}
        >
            {numAttendants.status === "ready" &&
                <Typography variant="caption" fontSize={"16px"}>
                    {(numAttendants.data > 1) && `${numAttendants.data} people are going`}
                    {(numAttendants.data === 1) && `${numAttendants.data} person is going`}
                    {(numAttendants.data === 0) && "Nobody is attending yet"}
                </Typography>}
        </Box>
    )
}


function EventTitle({ title }: { title: EventSchemaType["title"] }): JSX.Element {

    return (
        <Box sx={{
            width: "90%",
            height: "auto",
            textAlign: "center",
            color: "white",
        }} >
            <Typography component={"h2"} sx={{
                fontSize: "22px",
                fontWeight: "light",
                textAlign: "left",
                textWrap: "wrap"
            }} >
                {title}
            </Typography>

        </Box>
    )
}

function EventDescription({ description }: { description: EventSchemaType["description"] }): JSX.Element {


    return (
        <Box sx={{
            width: "100%",
            height: "auto",
            textAlign: "center",
            borderRadius: 2,
            gap: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start"
        }} >
            <Typography component={"h3"} sx={{
                textAlign: "left",
                color: "rgba(255, 255, 255, 0.85)",
                width: "100%",
                fontSize: "18px",
                fontWeight: "light",
                borderBottom: 1,
                borderColor: 'rgb(255, 255, 255, 0.15)'
            }}>
                Details
            </Typography>

            <Typography component={"p"} sx={{
                fontWeight: "light",
                fontSize: "14px",
                color: "white",
                textAlign: "left"
            }} >
                {description}
            </Typography>
        </Box>
    )
}


function StartTime({ startTime }: { startTime: string }) {


    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                textAlign: "center",
                borderRadius: 2,
                gap: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start"
            }}
        >
            <Typography component={"h3"} sx={{
                textAlign: "left",
                color: "rgba(255, 255, 255, 0.75)",
                width: "100%",
                fontSize: "14px",
                fontWeight: "light",

            }}>
                Starts at {startTime}
            </Typography>


        </Box>

    )
}
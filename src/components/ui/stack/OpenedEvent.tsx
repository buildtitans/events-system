"use client";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FadeInOutBox from "../box/fadeInOutBox";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { formatDateForUI } from "@/src/lib/utils/rendering/formatDateForUI";
import OpenedEventImage from "../box/cards/openedEventImage";


export default function OpenedEvent({ event }: { event: EventSchemaType }): JSX.Element {
    const thumbnail = event.img;
    const startTime = formatDateForUI(event.starts_at);

    return (
        <FadeInOutBox>
            <Stack sx={{
                paddingX: 3,
                paddingY: 6
            }} spacing={4}>

                <EventTitle
                    title={event.title}
                />

                <OpenedEventImage
                    thumbnail={thumbnail}
                />

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
                        color: "rgba(255, 255, 255, 0.75)",
                        width: "100%",
                        fontSize: "20px",
                        fontWeight: "light",
                        borderBottom: 1,
                        borderColor: 'rgb(255, 255, 255, 0.15)'
                    }}>
                        Details
                    </Typography>

                    <Typography component={"p"} sx={{
                        fontWeight: "light",
                        fontSize: "16px",
                        color: "white",
                        textAlign: "left"
                    }} >
                        {event.description}
                    </Typography>
                </Box>

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
                        fontSize: "20px",
                        fontWeight: "light",
                        borderBottom: 1,
                        borderColor: 'rgb(255, 255, 255, 0.15)'
                    }}>
                        Starts at
                    </Typography>

                    <Typography component={"p"} sx={{
                        fontWeight: "light",
                        fontSize: "16px",
                        color: "white",
                        textAlign: "left"
                    }} >
                        {startTime}
                    </Typography>
                </Box>
            </Stack>

        </FadeInOutBox>
    )
}


function EventTitle({ title }: { title: EventSchemaType["title"] }): JSX.Element {

    return (
        <Box sx={{
            width: "100%",
            height: "auto",
            textAlign: "center",
            color: "white",
        }} >
            <Typography component={"h2"} sx={{
                fontSize: "22px",
                fontWeight: "light",
                textAlign: "left"
            }} >
                {title}
            </Typography>

        </Box>
    )
}
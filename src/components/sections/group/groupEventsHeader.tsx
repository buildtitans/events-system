"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import Typography from "@mui/material/Typography";

export default function GroupEventsHeader(
    {
        groupName,
    }: {
        groupName: string,
    }
): JSX.Element | null {

    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <Typography
                component={"h2"}
                sx={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'light',
                    textAlign: "center"
                }}
            >
                {groupName}
            </Typography>
            <Typography
                component={"h2"}
                sx={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'light',
                    textAlign: "center"
                }}
            >
                Upcoming Events
            </Typography>
        </Box>
    )
}
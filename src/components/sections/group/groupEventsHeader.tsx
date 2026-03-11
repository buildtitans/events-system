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
                alignItems: "start",
                justifyContent: 'center',
            }}
        >
            <Typography
                component={"h2"}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '22px',
                    textAlign: "left",
                    fontWeight: "light"
                }}
            >
                Group
            </Typography>
            <Typography
                component={"h2"}
                sx={{
                    color: 'white',
                    fontSize: '26px',
                    textAlign: "left",
                    fontWeight: "light"
                }}
            >
                {groupName}
            </Typography>
            
        </Box>
    )
}
"use client";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import ErrorIcon from '@mui/icons-material/Error';


export default function ServerErrorFallback(): JSX.Element {

    //finish this fallback for server error on app boot

    return (
        <Container sx={{
            backgroundColor: '#FFCDD2',
            minHeight: '100svh',
        }}>
            <Stack
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                <ErrorIcon />

                <Typography component={"h1"} sx={{
                    fontSize: "32px",
                    fontWeight: 'light',
                    color: 'red'
                }}>
                    Internal Server Error


                </Typography>
            </Stack>

        </Container>
    )
}
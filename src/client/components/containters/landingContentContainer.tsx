"use client";
import { Box } from "@mui/material";
import Container from '@mui/material/Container';
import { PropsWithChildren } from "react";

type LandingContentContainerProps = PropsWithChildren<{ isMobile: boolean}>;

export default function LandingContentContainer({ children, isMobile }: LandingContentContainerProps) {

    return (
        <Container disableGutters>
            <Box
            sx={{
                    position: "relative",
                    overflow: "hidden",
                    px: { xs: 2.5, md: 4 },
                    py: { xs: 3, md: 4 },
                    borderRadius: { xs: 4, md: 5 },
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background:
                        "linear-gradient(180deg, rgba(20, 20, 20, 0.96) 0%, rgba(12, 12, 12, 0.92) 100%)",
                    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.28)",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: "-35% auto auto -10%",
                        width: { xs: 180, md: 260 },
                        height: { xs: 180, md: 260 },
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(110, 196, 255, 0.22) 0%, rgba(110, 196, 255, 0) 72%)",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: "auto -15% -35% auto",
                        width: { xs: 220, md: 320 },
                        height: { xs: 220, md: 320 },
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
                    },
                }}
            >
                {children}
            </Box>
        </Container>
    )
}


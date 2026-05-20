 "use client";
import { JSX } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import {
  noGroupsFallbackActionWrapSx,
  noGroupsFallbackDescriptionSx,
  noGroupsFallbackEyebrowSx,
  noGroupsFallbackHintSx,
  noGroupsFallbackIconSx,
  noGroupsFallbackIconWrapSx,
  noGroupsFallbackPanelSx,
  noGroupsFallbackRootSx,
  noGroupsFallbackTitleSx,
} from "@/src/client/styles/sx/noGroupsFallback";


type DashboardFallbackProps = {
    eyeBrow: 'Workspace',
    fallbackTitle: 'No groups created yet' | 'Nothing joined yet' | 'No commitments yet',
    fallbackBody: string,
    action?: React.ReactNode,
    icon?: React.ReactNode,
    actionCaption?: string;
}


export default function DashboardFallback({ 
    eyeBrow,
    fallbackTitle,
    fallbackBody,
    action,
    actionCaption,
    icon
 }: DashboardFallbackProps): JSX.Element {

    return (
        <Box sx={noGroupsFallbackRootSx}>
            <Stack
            alignItems={"center"}
            justifyContent={"center"}
            spacing={0}
            sx={noGroupsFallbackPanelSx}
            >
                <Box component={"header"} sx={noGroupsFallbackIconWrapSx}>
                    {icon}           
                </Box>

                <Box>
                    <Typography
                    variant="overline"
                    sx={noGroupsFallbackEyebrowSx}
                    >
                        {eyeBrow}
                    </Typography>
                    <Typography
                    variant="h4"
                    sx={noGroupsFallbackTitleSx}
                    >
                        {fallbackTitle}
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={noGroupsFallbackDescriptionSx}
                    >
                        {fallbackBody}
                    </Typography>
                </Box>

                <Box sx={noGroupsFallbackActionWrapSx}>
                    {action}
                </Box>

                <Typography
                variant="body2"
                sx={noGroupsFallbackHintSx}
                >
                    {actionCaption}
                    </Typography>
            </Stack>
        </Box>
    )
}

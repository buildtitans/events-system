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
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  noGroupsFallbackActionButtonSx,
  noGroupsFallbackActionWrapSx,
  noGroupsFallbackDescriptionSx,
  noGroupsFallbackEyebrowSx,
  noGroupsFallbackHintSx,
  noGroupsFallbackIconSx,
  noGroupsFallbackIconWrapSx,
  noGroupsFallbackPanelSx,
  noGroupsFallbackRootSx,
  noGroupsFallbackTitleSx,
} from "@/src/styles/sx/noGroupsFallback";


type DashboardFallbackProps = {
    eyeBrow: 'Workspace',
    fallbackTitle: 'No groups created yet' | 'Nothing joined yet' | 'No commitments yet',
    fallbackBody: string,
    action?: React.ReactNode,
    actionCaption?: string;
}


export default function UserHasCreatedNoGroups(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Box sx={noGroupsFallbackRootSx}>
            <Stack
            alignItems={"center"}
            justifyContent={"center"}
            spacing={0}
            sx={noGroupsFallbackPanelSx}
            >
                <Box component={"header"} sx={noGroupsFallbackIconWrapSx}>
                    <Groups2RoundedIcon sx={noGroupsFallbackIconSx} />
                </Box>

                <Box>
                    <Typography
                    variant="overline"
                    sx={noGroupsFallbackEyebrowSx}
                    >
                        Workspace
                    </Typography>
                    <Typography
                    variant="h4"
                    sx={noGroupsFallbackTitleSx}
                    >
                        No groups yet
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={noGroupsFallbackDescriptionSx}
                    >
                        Create your first community to start organizing events,
                        invite members, and build a shared schedule around the
                        things you care about.
                    </Typography>
                </Box>

                <Box sx={noGroupsFallbackActionWrapSx}>
                    <Button
                    onClick={() => dispatch(enqueueDrawer("new group"))}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={noGroupsFallbackActionButtonSx}
                    >
                        Create Group
                    </Button>
                </Box>

                <Typography
                variant="body2"
                sx={noGroupsFallbackHintSx}
                >
                    Once you create a group, it will show up here with quick
                    access to members, history, and upcoming events.
                    </Typography>
            </Stack>
        </Box>
    )
}

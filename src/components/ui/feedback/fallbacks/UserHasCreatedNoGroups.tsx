import { JSX } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';

export default function UserHasCreatedNoGroups(): JSX.Element {

    return (
        <Container>
            <Stack
            alignItems={"center"}
            justifyContent={"center"}
            >
                <Box component={"header"}>
                    <AnnouncementRoundedIcon 
                    color="disabled"
                    />
                </Box>

                <Box
                >
                    <Typography
                    variant="h4"
                    color="textDisabled"
                    fontWeight={"light"}
                    >
                        No groups created
                    </Typography>
                </Box>
            </Stack>
        </Container>
    )
}
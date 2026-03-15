import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupOffIcon from '@mui/icons-material/GroupOff';
import { JSX } from "react";
import Box from "@mui/material/Box";


export default function NoMemberships(): JSX.Element {

    return (
        <Container
        disableGutters
        sx={{
            height: "100%",
            width: "100%",
            
        }}
        >
            <Stack
            gap={4}
            justifyContent={"center"}
            alignItems={"center"}
                    sx={{
            height: "100%",
            width: "100%",
            minHeight: "300px"
        }}

            >
                <Box>
                    <GroupOffIcon
                    color="disabled"
                    sx={{
                        height: 52,
                        width: 52
                    }}
                    />
                </Box>
                
                <Box>
                    <Typography 
                    variant="body1" 
                    color="textDisabled"
                    >
                    No groups joined yet
                    </Typography>
                </Box>

                
            </Stack>
        </Container>
    )
}
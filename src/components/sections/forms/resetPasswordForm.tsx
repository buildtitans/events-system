import { Box, Container, OutlinedInput, Stack, Typography } from "@mui/material";



export default function ResetPasswordForm() {


    return (
        <Container>
            <Stack>
                <Box>
                    <Typography>
                        Reset Your Password
                    </Typography>
                </Box>

                
            </Stack>
            <Stack>
                <OutlinedInput 
                color="primary"
                
                />
            </Stack>
        </Container>
    )
}
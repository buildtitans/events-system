import FadeInOutBox from "../box/fadeInOutBox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function NotGroupMember() {


    return (
        <FadeInOutBox>
            <Box sx={{
                height: '100px',
                width: '100%',
                display: "Flex",
                alignItems: "center",
                justifyContent: 'center'
            }}>
                <Typography component={"h2"} sx={{
                    color: "white",

                }}>
                    Interesed in this event?
                </Typography>
                <Typography component={"h2"} sx={{
                    color: "white",

                }}>
                    Sign up with us and join this group to join the list of attendees
                </Typography>
            </Box>
        </FadeInOutBox>
    )
}
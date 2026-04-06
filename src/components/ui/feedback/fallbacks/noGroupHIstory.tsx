import FadeInOutBox from "@/src/components/ui/box/motionboxes/fadeInOutBox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export default function NoGroupHistory() {


    return (
        <FadeInOutBox>
            <Stack
                gap={6}
                justifyContent={"center"}
                alignItems={"start"}
                sx={{
                    height: "100%",
                    minHeight: "300px",
                    width: '100%',
                    margin: 'auto'
                }}
            >
                <Stack
                                gap={6}
                justifyContent={"center"}
                alignItems={"center"}

                >
                    <WatchLaterIcon 
                color="disabled"
                    />   

                <Typography color="textDisabled" component={"h3"} sx={{ fontSize: '28px', fontWeight: 'light', width: '100%', textAlign: "center" }}>
                    No events have been held for this group
                </Typography>

                </Stack>

                
            </Stack>
        </FadeInOutBox>
    )
}
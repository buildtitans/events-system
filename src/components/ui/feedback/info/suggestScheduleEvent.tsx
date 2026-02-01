import FadeInOutBox from "@/src/components/ui/box/fadeInOutBox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


export default function NoScheduledEvents() {


    return (
        <FadeInOutBox>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'start',
                    height: "100%",
                    width: '100%',
                    border: 1,
                    borderColor: "white"
                }}
            >
                <Typography component={"h3"} sx={{ fontSize: '28px', fontWeight: 'light' }}>
                    No events are currently scheduled for this group
                </Typography>

            </Stack>
        </FadeInOutBox>
    )
}
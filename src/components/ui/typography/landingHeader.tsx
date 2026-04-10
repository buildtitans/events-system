import Typography from "@mui/material/Typography"

function LandingHeader({ isMobile }: {isMobile: boolean}) {

    return (
        <div >
            <Typography variant={isMobile ? "h4" : "h2"} gutterBottom>
                Events
            </Typography>
            {/* <Typography>Stay in the loop with the latest about our products</Typography> */}
        </div>

    )
};


export { LandingHeader };
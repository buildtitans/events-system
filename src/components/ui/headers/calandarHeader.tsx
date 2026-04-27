import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { JSX } from "react";

export default 
function CalandarHeader(): JSX.Element {

    return (
   <Box>
            <Typography
            component={"h2"}
            sx={{
                fontSize: "24px",
                fontWeight: "light"
            }}
            >
            Current Schedule
            </Typography>
        </Box>
    )
}
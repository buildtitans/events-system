import { Box, Typography, Button, Stack, Fade } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  dashboardHeaderActionButtonSx,
  dashboardHeaderActionWrapSx,
  dashboardHeaderDescriptionSx,
  dashboardHeaderEyebrowSx,
  dashboardHeaderTitleSx,
  dashboardHeaderTitleWrapSx,
} from "@/src/client/styles/sx/dashboardHeader";
import { dashboardHeaderContent } from "@/src/lib/tokens/dashboardHeaderContent";

export default function DashboardHeader(): JSX.Element {
  const view = useSelector((s: RootState) => s.user.view);
  const dispatch = useDispatch<AppDispatch>();
  const content = dashboardHeaderContent[view];

  return (
   
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={{ xs: 2.5, md: 3 }}
          >
            <Fade key={view} in={true} timeout={300}>
<Box sx={dashboardHeaderTitleWrapSx}>
              <Typography variant="overline" sx={dashboardHeaderEyebrowSx}>
                {content.eyebrow}
              </Typography>
              <Typography variant="h3" sx={dashboardHeaderTitleSx}>
                {content.title}
              </Typography>
              <Typography variant="body1" sx={dashboardHeaderDescriptionSx}>
                {content.description}
              </Typography>
            </Box>
            </Fade>
            
            <Fade in={view === "my groups"} key={"my-groups-fade-wrapper"}  timeout={300}>
<Box sx={dashboardHeaderActionWrapSx}>
                <Button
                  suppressHydrationWarning={true}
                  onClick={() => dispatch(enqueueDrawer("new group"))}
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={dashboardHeaderActionButtonSx}
                >
                  Create Group
                </Button>
              </Box>
            </Fade>
          </Stack>
  );
}

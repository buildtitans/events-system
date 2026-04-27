import { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { createGroupButtonSx } from "@/src/styles/sx/sx";


export default function DashboardHeader(): JSX.Element {
  const view = useSelector((s: RootState) => s.user.view);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Stack
      gap={6}
      sx={{
        width: "100%",
        height: {
          md: 120,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "98%",
          height: "auto",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            color="primary.info"
            fontWeight={"light"}
            fontSize={"30px"}
          >
            {getHeaderTitle(view)}
          </Typography>
        </Box>
        {view === "my groups" && (
          <Box>
            <Button
              suppressHydrationWarning={true}
              onClick={() => dispatch(enqueueDrawer("new group"))}
              variant="contained"
              size="small"
              color="primary"
              startIcon={<AddIcon />}
              sx={createGroupButtonSx}
            >
              Create Group
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
    </Stack>
  );
}


function getHeaderTitle(view: UserAccountViewType) {
  switch (view) {
    case "memberships": {
      return "Memberships";
    }
    case "rsvps": {
      return "RSVP'd Events";
    }
    case "my groups": {
      return "My Groups";
    }

    default: {
      return null;
    }
  }
}

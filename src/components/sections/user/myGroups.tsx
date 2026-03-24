"use client";
import type { JSX } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { createGroupButtonSx } from "@/src/styles/sx/sx";
import RenderMyGroups from "../../pipelines/groups/renderMyGroups";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";


export default function MyGroups(): JSX.Element {
  const myGroups = useSelector((s: RootState) => s.user.myGroups);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Stack
    gap={6}
    divider={<Divider />}
    sx={{
      width: "100%"
    }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "98%", height: "auto"}}>
        <Box>
          <Typography
        variant="h4"
        color="primary.info"
        fontWeight={"light"}
        fontSize={"30px"}
        >
          My groups
        </Typography>
        </Box>
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

      </Box>
        <RenderMyGroups  myGroups={myGroups} />
    </Stack>
  );
}

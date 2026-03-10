"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Grid from "@mui/material/Grid";
import RenderMyGroups from "../../pipelines/groups/renderMyGroups";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function MyGroups(): JSX.Element {
  const myGroups = useSelector((s: RootState) => s.user.myGroups);
  const participations = useSelector((s: RootState) => s.user.participations);

  console.log(participations);

  return (
    <Stack
    gap={6}
    direction={"column"}
    alignItems={"start"}
    justifyContent={"start"}
    >
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
      <Grid>
        <RenderMyGroups myGroups={myGroups} />
      </Grid>
    </Stack>
  );
}

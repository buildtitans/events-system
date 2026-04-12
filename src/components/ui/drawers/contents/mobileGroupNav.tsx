"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  CurrentDisplay,
  displaySection,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useEffect } from "react";

export default function MobileGroupNav() {
  const dispatch = useDispatch<AppDispatch>();
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  const labels: CurrentDisplay[] = ["overview", "events", "group history"];

  useEffect(() => {

    return () => {
      dispatch(displaySection("overview"))
    }
  }, [])


  return (
    <Paper
      component={"nav"}
      variant="outlined"
      sx={{
        width: "100%",
        backgroundColor: "paper.background",
        borderTop: 1,
        borderTopColor: "rgba(255, 255, 255, 0.4)",
        padding: 2,
      }}
    >
      <Stack
        gap={2}
            direction={"row"} 
            alignItems={"center"} 
            justifyContent={"center"}
      >
        {labels.map((label) => (
          <Button
            key={label}
            onClick={() => dispatch(displaySection(label))}
            type="button"
            variant={displayed === label ? "contained"
                  : "outlined" }
            size="small"
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}

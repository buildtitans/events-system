"use client";
import { noGroupsFallbackActionButtonSx } from "@/src/client/styles/sx/noGroupsFallback";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function CreateNewGroupButton({}) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Button
      onClick={() => dispatch(enqueueDrawer("new group"))}
      variant="contained"
      startIcon={<AddIcon />}
      sx={noGroupsFallbackActionButtonSx}
    >
      Create Group
    </Button>
  );
}

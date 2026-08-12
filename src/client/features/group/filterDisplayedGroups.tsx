import type { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import TuneIcon from "@mui/icons-material/Tune";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { openGroupsFilterButtonSx } from "@/src/client/styles/sx/groupFilter";

export default function FilterDisplayedGroups() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Button
      onClick={() => dispatch(enqueueDrawer("filter groups"))}
      variant="outlined"
      size="medium"
      endIcon={<TuneIcon />}
      sx={openGroupsFilterButtonSx}
    >
      Filter Groups
    </Button>
  );
}

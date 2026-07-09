import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { AppBootState } from "@/src/lib/types/state/types";

type SimpleBackdropProps = {
  status?: AppBootState["status"];
};

export default function SimpleBackdrop({
  status,
}: SimpleBackdropProps): React.ReactNode {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={status ? status === "pending" : true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

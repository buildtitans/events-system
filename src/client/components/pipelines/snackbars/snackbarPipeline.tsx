"use client";
import { JSX } from "react";
import AuthenticatonSnackbar from "../../ui/feedback/pending/authenticationSnackbar";
import { SnackbarStatusAndKind } from "@/src/lib/store/slices/rendering/types";

function snackbarPipeline(
  kind: SnackbarStatusAndKind["kind"],
  status: SnackbarStatusAndKind["status"],
): JSX.Element | null {
  if (kind) {
    return (
      <AuthenticatonSnackbar
        key={"snackbar"}
        statusKind={kind}
        status={status}
      />
    );
  }

  return null;
}

export { snackbarPipeline };

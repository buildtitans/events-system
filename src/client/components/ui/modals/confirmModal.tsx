"use client";
import type { ActiveModal } from "@/src/lib/store/slices/rendering/types";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logout } from "@/src/lib/store/slices/auth/AuthSlice";
import {
  enqueueSnackbar,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AuthenticationSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  confirmModalActionsSx,
  confirmModalBackdropSx,
  confirmModalBodySx,
  confirmModalEyebrowSx,
  confirmModalPaperSx,
  confirmModalPrimaryButtonSx,
  confirmModalSecondaryButtonSx,
  confirmModalTitleSx,
} from "@/src/client/styles/sx/confirmModal";

export default function ConfirmModal({
  activeModal,
}: {
  activeModal: ActiveModal;
}) {
  const dispatch = useDispatch<AppDispatch>();

  async function handleLogoutResponse(
    success: AuthenticationSchemaType["success"],
  ) {
    dispatch(logout());
    dispatch(
      enqueueSnackbar({
        kind: "logout",
        status: success ? "success" : "failed",
      }),
    );
    
    dispatch(showModal(null));
  }
  const handleSignout = async (): Promise<void> => {
    dispatch(enqueueSnackbar({ kind: "logout", status: "pending" }));
    const res = await trpcClient.auth.signout.mutate();
    await handleLogoutResponse(res ? true : false);
  };

  return (
    <Modal
      open={activeModal !== null}
      onClose={() => dispatch(showModal(null))}
      component={"section"}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: confirmModalBackdropSx,
        },
      }}
    >
      <Fade in={activeModal !== null}>
        <Box sx={confirmModalPaperSx}>
          <Stack spacing={2}>
            <Typography component="span" sx={confirmModalEyebrowSx}>
              Account
            </Typography>
            <Typography
              id="transition-modal-title"
              component="h2"
              sx={confirmModalTitleSx}
            >
              Sign out?
            </Typography>
            <Typography component="p" sx={confirmModalBodySx}>
              You&apos;ll need to sign in again to access your dashboard,
              memberships, and organizer tools.
            </Typography>
          </Stack>
          <Box sx={confirmModalActionsSx}>
            <Button
              onClick={() => dispatch(showModal(null))}
              type="button"
              variant="outlined"
              startIcon={<CloseRoundedIcon />}
              sx={confirmModalSecondaryButtonSx}
            >
              Stay signed in
            </Button>
            <Button
              onClick={handleSignout}
              type="button"
              variant="contained"
              startIcon={<LogoutRoundedIcon />}
              sx={confirmModalPrimaryButtonSx}
            >
              Sign out
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

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
import type { AppDispatch } from "@/src/lib/store";
import {
  enqueueDrawer,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
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

export default function SuggestJoinModal({
  activeModal,
}: {
  activeModal: ActiveModal;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const open = activeModal === "suggest join";

  const closeModal = () => {
    dispatch(showModal(null));
  };

  const openSignupDrawer = () => {
    dispatch(showModal(null));
    dispatch(enqueueDrawer("sign up drawer"));
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
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
      <Fade in={open}>
        <Box sx={confirmModalPaperSx}>
          <Stack spacing={2}>
            <Typography component="span" sx={confirmModalEyebrowSx}>
              Membership
            </Typography>
            <Typography
              id="suggest-join-modal-title"
              component="h2"
              sx={confirmModalTitleSx}
            >
              Sign up to join
            </Typography>
            <Typography
              id="suggest-join-modal-description"
              component="p"
              sx={confirmModalBodySx}
            >
              Create an account to become a member, RSVP to this group&apos;s
              events, and keep up with new activity.
            </Typography>
          </Stack>
          <Box sx={confirmModalActionsSx}>
            <Button
              onClick={closeModal}
              type="button"
              variant="outlined"
              startIcon={<CloseRoundedIcon />}
              sx={confirmModalSecondaryButtonSx}
            >
              Maybe later
            </Button>
            <Button
              onClick={openSignupDrawer}
              type="button"
              variant="contained"
              startIcon={<HowToRegRoundedIcon />}
              sx={confirmModalPrimaryButtonSx}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

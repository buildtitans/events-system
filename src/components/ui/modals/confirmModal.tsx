"use client";
import type { ActiveModal } from "@/src/lib/store/slices/rendering/RenderingSlice";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logout } from "@/src/lib/store/slices/auth/AuthSlice";
import {
  enqueueSnackbar,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AuthenticationSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { wait } from "@/src/lib/utils/rendering/wait";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function ConfirmModal({
  activeModal,
}: {
  activeModal: ActiveModal;
}) {
  const dispatch = useDispatch<AppDispatch>();

  async function handleLogoutResponse(
    success: AuthenticationSchemaType["success"],
  ) {
    await wait(1000);
    dispatch(
      enqueueSnackbar({
        kind: "logout",
        status: success ? "success" : "failed",
      }),
    );
    dispatch(logout());
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
        },
      }}
    >
      <Fade in={activeModal !== null}>
        <Box sx={style}>
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            sx={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "light",
            }}
          >
            Sign Out?
          </Typography>
          <Box
            sx={{
              paddingY: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Button onClick={handleSignout} type="button" variant="contained">
              Yes
            </Button>
            <Button 
            onClick={() => dispatch(showModal(null))}
            type="button" 
            variant="contained">
              No
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

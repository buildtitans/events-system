"use client";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AppDispatch } from "@/src/lib/store";
import Container from "@mui/material/Container";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import type { JSX } from "react";
import Notifications from "../menus/notifications/notifications";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { navActionsButtonSx } from "@/src/styles/sx/sx";
import RenderCurrentUser from "@/src/components/pipelines/buttons/renderCurrentUser";

type NavActionsProps = {
  userKind: UserKind;
  openSignupDrawer: () => void;
  showSignoutModal: () => void;
};

export default function NavActions({
  userKind,
  openSignupDrawer,
  showSignoutModal,
}: NavActionsProps): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Container
      sx={{
        display: {
          xs: "none",
          md: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

        },
      }}
    >
     

      <Box 
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 2
      }}
      >
{userKind === "authenticated" && (
        <Button
          suppressHydrationWarning={true}
          onClick={() => dispatch(enqueueDrawer("new group"))}
          variant="text"
          color="info"
          size="small"
          startIcon={<AddIcon />}
          sx={navActionsButtonSx}
        >
          Create Group
        </Button>
      )}
      {userKind === "anonymous" && (
        <Button
          suppressHydrationWarning={true}
          onClick={() => dispatch(enqueueDrawer("sign in drawer"))}
          color="info"
          variant="contained"
          size="small"
          sx={navActionsButtonSx}
        >
          Sign in
        </Button>
      )}{" "}
      {userKind === "anonymous" && (
        <Button
          suppressHydrationWarning={true}
          onClick={openSignupDrawer}
          sx={navActionsButtonSx}
          color="info"
          variant="contained"
          size="small"
        >
          Sign up
        </Button>
      )}
      {userKind === "authenticated" && (
        <Button
          suppressHydrationWarning={true}
          sx={navActionsButtonSx}
          onClick={showSignoutModal}
          color="info"
          variant="contained"
          size="small"
        >
          Sign out
        </Button>
      )}
      </Box>


       <Box 
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 2
      }}
      >
      {userKind === "authenticated" && <Notifications />}


      {userKind === "authenticated" && <RenderCurrentUser key={"account-link"} />}


      </Box>
    </Container>
  );
}

"use client";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AppDispatch } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import type { JSX } from "react";
import Notifications from "../menus/notifications/notifications";
import useMediaQuery from "@mui/material/useMediaQuery";

type NavActionsProps = {
  userKind: UserKind;
  handleSignout: () => Promise<void>;
  openSignupDrawer: () => void;
};

export default function NavActions({
  userKind,
  handleSignout,
  openSignupDrawer,
}: NavActionsProps): JSX.Element | null {
  const xsToLg = useMediaQuery("min-width(1250px)");
  const dispatch = useDispatch<AppDispatch>();
  const buttonSize = xsToLg ? "small" : "medium";
  const fontSize = xsToLg ? "10px" : "14px";

  return (
    <Stack
      sx={{
        display: {
          xs: "none",
          md: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Container
        sx={{
          display: {
            xs: "none",
            md: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: userKind === "authenticated" ? 40 : 8,
          },
        }}
      >
        {userKind === "authenticated" && <Notifications />}
        {userKind === "authenticated" && (
          <Button
            suppressHydrationWarning={true}
            onClick={() => dispatch(enqueueDrawer("new group"))}
            variant="text"
            color="info"
            size={buttonSize}
            sx={{
              borderRadius: 999,
              backgroundColor: "white",
              fontSize: fontSize,
              color: "black",
              ":hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                transition: "all 0.3s ease",
              },
            }}
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
            
            size={buttonSize}
            sx={{
              borderRadius: 999,
                              fontSize: fontSize,
              ":hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "white",

                transition: "all 0.3s ease",
              },
            }}
          >
            Sign in
          </Button>
        )}{" "}
        {userKind === "anonymous" && (
          <Button
            suppressHydrationWarning={true}
            onClick={openSignupDrawer}
            sx={{
              borderRadius: 999,
              fontSize: fontSize,
              ":hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                
                transition: "all 0.3s ease",
              },
            }}
            color="info"
            variant="contained"
            size={buttonSize}
          >
            Sign up
          </Button>
        )}
        {userKind === "authenticated" && (
          <Button
            suppressHydrationWarning={true}
            sx={{
              fontSize: fontSize,
              borderRadius: 999,
              ":hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                
                transition: "all 0.3s ease",
              },
            }}
            onClick={handleSignout}
            color="info"
            variant="contained"
            size={buttonSize}
          >
            Sign out
          </Button>
        )}
      </Container>
    </Stack>
  );
}

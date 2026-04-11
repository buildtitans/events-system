import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { JSX } from "react";

export default function RenderMobileAuthButtons({
    userKind, 
    showSigninDrawer,
    showSignoutModal
}: {
    userKind: UserKind, 
    showSigninDrawer: () => void,
    showSignoutModal: () => void
}): JSX.Element {
  switch (userKind) {
    case "authenticated": {
      return (
        <Stack>
          <Button
              onClick={showSignoutModal}
              type="button"
              color="primary"
              variant="contained"
              fullWidth
            >
              Sign Out
            </Button>
        </Stack>
      );
    }
    case "anonymous": {
      return (
        <Stack>
          <Button color="primary" variant="outlined" fullWidth>
            Sign up
          </Button>

            <Button
              onClick={showSigninDrawer}
              type="button"
              color="primary"
              variant="contained"
              fullWidth
            >
              Sign in
            </Button>
        </Stack>
      );
    }
  }
}

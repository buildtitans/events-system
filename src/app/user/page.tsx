import HydrateUserAccountPage from "@/src/components/hydration/HydrateUserAccountPage";
import UserAccount from "@/src/components/pages/userAccountPage";
import Container from "@mui/material/Container";
import { JSX } from "react";

export default function UserPage(): JSX.Element {
  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100svh",
      }}
    >
      <HydrateUserAccountPage />
     <UserAccount />
    </Container>
  );
}

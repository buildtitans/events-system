import Container from "@mui/material/Container";
import DesktopNav, { NavProps } from "../../global/nav/desktop/desktopNav";
import MobileNav from "../../global/nav/mobile/mobileNav";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderNavigationProps = {
  isMobile: boolean;
  navProps: NavProps;
};

export default function RenderNavigation({
  isMobile,
  navProps,
}: RenderNavigationProps) {
  switch (isMobile) {
    case true: {
      return (
        <MobileNav
          openSignupDrawer={navProps.openSignupDrawer}
          showSignoutModal={navProps.showSignoutModal}
        />
      );
    }

    case false: {
      return (
        <Container
          disableGutters
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { md: 3 },
          }}
        >
          <DesktopNav
            openSignupDrawer={navProps.openSignupDrawer}
            showSignoutModal={navProps.showSignoutModal}
          />
        </Container>
      );
    }

    default: {
      return assertNever(isMobile);
    }
  }
}

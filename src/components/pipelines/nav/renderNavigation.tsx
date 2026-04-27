import Container from "@mui/material/Container";
import DesktopNav, { NavProps } from "../../global/nav/desktop/desktopNav";
import MobileNav from "../../global/nav/mobile/mobileNav";

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

    default: {
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
  }
}

"use client";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  footerBottomNoteSx,
  footerBottomRowSx,
  footerContainerSx,
  footerCopyrightSx,
  footerDescriptionSx,
  footerEyebrowSx,
  footerLinkLabelSx,
  footerLinkSx,
  footerLinksWrapSx,
  footerRootSx,
  footerSurfaceSx,
  footerTitleSx,
  footerTopGridSx,
} from "@/src/client/styles/sx/footer";

type FooterLinkType = {
  href:
    | "https://github.com/buildtitans/events-system"
    | "https://www.linkedin.com/in/trentirvin/";
  label: "GitHub" | "LinkedIn";
};

const footerLinks = [
  {
    href: "https://github.com/buildtitans/events-system",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/trentirvin/",
    label: "LinkedIn",
  },
] satisfies FooterLinkType[];

export default function Footer() {
  return (
    <Box component="footer" sx={footerRootSx}>
      <Container sx={footerContainerSx}>
        <Box sx={footerSurfaceSx}>
          <Stack spacing={5}>
            <Box sx={footerTopGridSx}>
              <Box sx={{ maxWidth: 560 }}>
                <Typography component="span" sx={footerEyebrowSx}>
                  Build Titans LLC
                </Typography>
                <Typography variant="h4" sx={footerTitleSx}>
                  Events System
                </Typography>
                <Typography variant="body1" sx={footerDescriptionSx}>
                  Internal Product demo for Build Titans LLC
                </Typography>
              </Box>

              <Stack
                spacing={1.5}
                sx={{ alignItems: { xs: "flex-start", md: "flex-end" } }}
              >
                <Typography component="span" sx={footerLinkLabelSx}>
                  Connect
                </Typography>
                <Stack direction="row" sx={footerLinksWrapSx}>
                  {footerLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      underline="none"
                      target="_blank"
                      rel="noreferrer"
                      sx={footerLinkSx}
                    >
                      {link.label === "GitHub" ? (
                        <GitHubIcon />
                      ) : (
                        <LinkedInIcon />
                      )}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Box>

            <Box sx={footerBottomRowSx}>
              <Typography variant="body2" sx={footerCopyrightSx}>
                {"\u00A9"} Build Titans LLC
              </Typography>
              <Typography variant="body2" sx={footerBottomNoteSx}>
                Community-driven event discovery and organizer workflows.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

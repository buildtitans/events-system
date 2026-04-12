"use client";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type FooterLinkType = {
  href: "https://github.com/buildtitans/events-system" | "https://www.linkedin.com/in/trentirvin/",
  label:  "GitHub" | "LinkedIn"
}

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
  const year = new Date().getFullYear();

  return (
    <>
      <Divider />
      <Container
        sx={{
          py: { xs: 6, sm: 8 },
        }}
      >
        <Stack spacing={5}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
              gap: 4,
              alignItems: "start",
            }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Events System
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", maxWidth: 520 }}
              >
                Internal Product demo for Build Titans LLC
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={3}
              useFlexGap
              sx={{
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                alignItems: "center",
              }}
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="text.primary"
                  variant="body2"
                  underline="hover"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ fontWeight: 600 }}
                  
                >
                  {link.label === "GitHub" ? (<GitHubIcon />) : (<LinkedInIcon />)}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1.5,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ color: "text.secondary" }}>
              © Build Titans LLC
            </Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

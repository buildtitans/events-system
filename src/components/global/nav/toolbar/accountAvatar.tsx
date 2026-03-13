"use client";
import { blueGrey, blue } from "@mui/material/colors";
import { useMemo, type JSX } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { clipEmail } from "@/src/lib/utils/parsing/clipEmail";

type CurrentUserProps = {
  email: string
};

export default function CurrentUser({ email }: CurrentUserProps): JSX.Element {
  const router = useRouter();

  const handleClick = () => {
    const route = "/user";
    router.push(route);
  };

  const clippedEmail = clipEmail(email);

  return (
    <Button
      onClick={handleClick}
      type="button"
      variant="outlined"
      size="small"
      color="info"
      sx={{
        borderRadius: 999,
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          transition: "all 0.3s ease",
        },
      }}
    >
      <Stack
        alignItems={"center"}
        gap={1}
        direction={"row"}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Avatar
          variant="circular"
          sx={{
            width: 26,
            height: 26,
            fontWeight: "light",
            bgcolor: "black",
            color: "white",
          }}
        >
          {email[0]}
        </Avatar>
        <Box>
          <Typography
          variant="button"
          fontSize={"12px"} 
          sx={{ textTransform: "lowercase"}}
          >
            {clippedEmail + "..."}
          </Typography>
        </Box>
      </Stack>
    </Button>
  );
}

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Divider from "@mui/material/Divider";

type GroupDescriptionProps = {
  group: GroupSchemaType;
};

export default function GroupDescription({
  group,
}: GroupDescriptionProps): JSX.Element {
  const memberCount = useSelector((s: RootState) => s.openGroup.numMembers);
  const organizerEmail = useSelector((s: RootState) => s.openGroup.organizerEmail);


  return (
    <Stack
      sx={{
        width: "100%",
      }}
      gap={2}
    >
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
          fontSize={"14px"}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Community Details
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={"14px"}>{group.description}</Typography>
        </Box>
      </Stack>

      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
          fontSize={"14px"}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Location
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={"14px"}>
            {group.location === "Online"
              ? "This group hosts events online"
              : group.location}
          </Typography>
        </Box>
      </Stack>

      <Stack
      direction={"row"}
      divider={<Divider  
        sx={{ opacity: 0.6 }}
        orientation="vertical"
      />}
      >
                <Stack
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
          fontSize={"14px"}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Number of Members
          </Typography>
          <Typography fontSize={"14px"}>
            {memberCount}
          </Typography>
        </Box>
      </Stack>

            <Stack
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
          fontSize={"14px"}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Organizer
          </Typography>
          <Typography fontSize={"14px"}>
            {organizerEmail}
          </Typography>
        </Box>
      </Stack>            
      </Stack>


    </Stack>
  );
}

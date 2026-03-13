"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import MembershipListItem from "../../ui/list/membership";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";

type MyMembershipsProps = {
  memberships: UserMembershipSchemaType[];
};

export default function MyMemberships({
  memberships,
}: MyMembershipsProps): JSX.Element | null {
  const nextEventLookup = useSelector((s: RootState) => s.user.nextEventLookup);

  return (
    <Container>
      <Stack
        gap={6}
        divider={<Divider />}
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            color="primary.info"
            fontWeight={"light"}
            fontSize={"30px"}
          >
            Memberships
          </Typography>
        </Box>

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {memberships.map((membership) => (
            <MembershipListItem
              key={membership.group_id}
              membership={membership}
              nextEvent={nextEventLookup[membership.group_id]}
            />
          ))}
        </List>
      </Stack>
    </Container>
  );
}

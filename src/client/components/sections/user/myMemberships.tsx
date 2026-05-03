"use client";
import { type JSX } from "react";
import type { RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import MembershipListItem from "../../ui/list/membership";
import List from "@mui/material/List";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { useRouter } from "next/navigation";

type MyMembershipsProps = {
  memberships: UserMembershipSchemaType[];
};

export default function MyMemberships({
  memberships,
}: MyMembershipsProps): JSX.Element | null {
  const router = useRouter();
  const nextEventLookup = useSelector(
    (s: RootState) => s.user.nextEventLookup,
  );

  const handleClick = (slug: UserMembershipSchemaType["group_slug"]) => {
    const path = `/group/${slug}`;
    router.push(path);
  };

  return (
    <Container>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {memberships.map((membership) => (
          <MembershipListItem
            key={membership.group_id}
            handleClick={handleClick}
            membership={membership}
            nextEvent={nextEventLookup[membership.group_id]}
          />
        ))}
      </List>
    </Container>
  );
}

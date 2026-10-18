"use client";
import { type JSX } from "react";

import Container from "@mui/material/Container";

import MembershipListItem from "@/src/client/components/ui/list/memberships/membership";
import List from "@mui/material/List";
import { UserMembershipSurfaceSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { useRouter } from "next/navigation";

type MyMembershipsProps = {
  memberships: UserMembershipSurfaceSchemaType[];
};

export default function MyMemberships({
  memberships,
}: MyMembershipsProps): JSX.Element | null {
  const router = useRouter();

  const handleClick = (
    slug: UserMembershipSurfaceSchemaType["membership"]["group_slug"],
  ) => {
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
            key={membership.membership.group_id}
            handleClick={handleClick}
            membership={membership}
          />
        ))}
      </List>
    </Container>
  );
}

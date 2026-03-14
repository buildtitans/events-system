import { RootState } from "@/src/lib/store";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RenderRoleBasedSidebarContents } from "../forks/renderRoleBasedSidebarContents";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

type SidebarPipelineProps = {
  group_id: GroupSchemaType["id"];
  role: GroupMemberSchemaType["role"];
};

export const SidebarActionsPipeline = ({
  group_id,
  role,
}: SidebarPipelineProps): JSX.Element | null => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);

  switch (userKind) {
    case "authenticated": {
      return (
        <RenderRoleBasedSidebarContents 
        group_id={group_id}
        role={role}
        />
      )
    }
    case "anonymous":
      return null;

    default: {
      return null;
    }
  }
};

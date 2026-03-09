import { RootState } from "@/src/lib/store";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RenderSidebarContents } from "./renderAuthenticatedSidebar";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";

type SidebarPipelineProps = {
  group_id: GroupSchemaType["id"];
  role: GroupMembersSchemaType["role"];
};

export const SidebarActionsPipeline = ({
  group_id,
  role,
}: SidebarPipelineProps): JSX.Element | null => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);

  switch (userKind) {
    case "authenticated":
      return RenderSidebarContents({ role, group_id });
    case "anonymous":
      return null;

    default: {
      return null;
    }
  }
};

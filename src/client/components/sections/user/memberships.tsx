import { useHydrateMemberships } from "@/src/lib/hooks/hydration/user/useHydrateUser";
import { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import RenderMemberships from "../../pipelines/user/renderMemberships";

export default function Memberships() {
  useHydrateMemberships();
  const memberships = useSelector((s: RootState) => s.user.memberships);

  return <RenderMemberships state={memberships} />;
}

import { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import RenderRsvps from "../../pipelines/user/renderMyRsvps";
import { useHydrateRsvps } from "@/src/lib/hooks/hydration/user/useHydrateRsvps";

export default function Rsvps() {
  useHydrateRsvps();
  const rsvps = useSelector((s: RootState) => s.user.rsvps);

  return <RenderRsvps state={rsvps} />;
}

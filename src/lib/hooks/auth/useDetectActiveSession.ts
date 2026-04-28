import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueSidebar } from "../../store/slices/rendering/RenderingSlice";
import { useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { changeAccountTab } from "../../store/slices/user/userSlice";

export const useDetectActiveSession = () => {
  const router = useRouter();
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userKind === "authenticated") return;

    if (userKind === "anonymous") {
      router.push("/");
      dispatch(enqueueSidebar(null));
    }
  }, [userKind, router, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(changeAccountTab("my groups"));
    };
  }, []);
};

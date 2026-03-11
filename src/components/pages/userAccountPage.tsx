"use client";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import AccountDetails from "../sections/user/accountDetails";
import Stack from "@mui/material/Stack";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useHydrateMyRsvps } from "@/src/lib/hooks/hydration/useHydrateMyRSVPs";
import RenderUserAccount from "../pipelines/user/renderUserAccount";

export default function UserAccount(): JSX.Element {
  useHydrateMyRsvps();
  const router = useRouter();
  const email = useSelector((s: RootState) => s.user.email);
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if(userKind === "authenticated") return;

    if(userKind === "anonymous") {
      router.push("/");
      dispatch(enqueueSidebar(null));
    }

  }, [userKind])

    return (
         <Stack
        alignItems={"center"}
        sx={{
          minHeight: "100svh",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <RenderUserAccount email={email} />
        
      </Stack>
    )
}
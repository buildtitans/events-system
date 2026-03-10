"use client";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import AccountDetails from "../sections/user/accountDetails";
import Stack from "@mui/material/Stack";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function UserAccount(): JSX.Element {
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
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minHeight: "100svh",
          minWidth: "100%",
        }}
      >
        {(email.status === "ready") && <AccountDetails 
        email={email.data}
        />}
        
      </Stack>
    )
}
"use client";
import AccountDetails from "@/src/client/components/sections/user/accountDetails";
import type { UserEmailState } from "@/src/lib/store/slices/user/types";
import SimpleBackdrop from "@/src/client/components/ui/feedback/pending/backdrop";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export default function RenderUserAccount({
  email,
}: {
  email: UserEmailState;
}): JSX.Element | null {
  switch (email.status) {
    case "ready": {
      return <AccountDetails email={email.data} />;
    }

    case "failed": {
      return <AsyncFailedFallback message={email.error} />;
    }

    case "pending": {
      return <SimpleBackdrop />;
    }

    case "n/a": {
      return <AsyncFailedFallback message={email.message} />;
    }

    case "initial": {
      return null
    }

    default: {
      return assertNever(email);
    }
  }
}

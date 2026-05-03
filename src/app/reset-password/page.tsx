"use client";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/src/client/components/sections/forms/auth/resetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return <ResetPasswordForm token={token} />;
}


"use client";
import { useHydrateSearch } from "@/src/lib/hooks/hydration/useHydrateSearch";
import React from "react";

export default function SearchHydrator(): React.ReactNode {
    useHydrateSearch();
    return null;
};
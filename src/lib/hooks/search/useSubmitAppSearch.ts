"use client";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { resetSearchResults } from "@/src/lib/store/slices/search/appSearchSlice";
import { useRouter } from "next/navigation";

export const useSubmitAppSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const results = useSelector((state: RootState) => state.search.results);
  const router = useRouter();

  const submitSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) return;

      const params = new URLSearchParams({ q: trimmedQuery });
      router.push(`/search?${params.toString()}`);
    },
    [router],
  );

  const resetResults = useCallback(() => {
    dispatch(resetSearchResults());
  }, [dispatch]);

  return {
    submitSearch,
    results,
    resetResults,
  };
};

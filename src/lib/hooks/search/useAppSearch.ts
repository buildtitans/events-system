"use client";
import type { RootState, AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { searchQuery } from "@/src/lib/store/slices/search/thunks";
import { getSearchResults } from "../../store/slices/search/appSearchSlice";
import { useRouter } from "next/navigation";

export const useSubmitAppSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const results = useSelector((state: RootState) => state.search.results);
  const router = useRouter();

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        dispatch(getSearchResults({ status: "initial" }));
        return;
      }

      await dispatch(searchQuery({ query: trimmedQuery }));
      router.push(`/${trimmedQuery}`);
    },
    [dispatch],
  );

  const resetResults = useCallback(() => {
    dispatch(getSearchResults({ status: "initial" }));
  }, [dispatch]);

  return {
    search,
    results,
    resetResults,
  };
};

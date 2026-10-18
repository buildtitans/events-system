import { AppDispatch } from "@/src/lib/store";
import { hydrateUserRsvps } from "@/src/lib/store/slices/user/thunks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useHydrateRsvps = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeHydrateRsvps = async () => {
      await dispatch(hydrateUserRsvps());
    };

    void executeHydrateRsvps();
  }, [dispatch]);
};

import { type ReactNode, type JSX, Fragment } from "react";
import type { AsyncState } from "@/src/lib/types/state/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { RelativeSpinner } from "@/src/client/components/ui/feedback/pending/spinner";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import FadeIn from "../ui/box/motionboxes/fadeIn";

type AsyncStateRendererProps<
  T,
  EmptyMessage extends string = "No date found",
> = {
  state: AsyncState<T, EmptyMessage>;
  children: (data: T) => ReactNode;
  empty?: (message: EmptyMessage) => ReactNode;
  pending?: () => ReactNode;
  initial?: () => ReactNode;
};

export function AsyncStateRenderer<
  T,
  EmptyMessage extends string = "No date found",
>({
  state,
  children,
  empty,
  initial,
  pending,
}: AsyncStateRendererProps<T, EmptyMessage>): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return <Fragment>{initial?.() ?? null}</Fragment>;
    }
    case "n/a": {
      if (!empty) return null;

      return (
        <FadeIn keyValue="async-empty-fade-in">{empty(state.message)}</FadeIn>
      );
    }
    case "pending": {
      if (!pending) {
        return (
          <FadeIn keyValue="async-pending-fade-in">
            <RelativeSpinner />
          </FadeIn>
        );
      }

      const pendingNode = pending();
      if (pendingNode == null) return null;

      return <FadeIn keyValue="async-pending-fade-in">{pendingNode}</FadeIn>;
    }

    case "ready": {
      return <FadeIn keyValue="async-fade-in">{children(state.data)}</FadeIn>;
    }
    case "failed": {
      return (
        <FadeIn keyValue="async-fade-in">
          <AsyncFailedFallback error={state.error} />
        </FadeIn>
      );
    }

    default: {
      return assertNever(state);
    }
  }
}

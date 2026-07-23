import { type ReactNode, type JSX, Fragment, ReactElement } from "react";
import type { AsyncState } from "@/src/lib/types/state/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import Spinner from "@/src/client/components/ui/feedback/pending/spinner";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import FadeIn from "../../ui/box/motionboxes/fadeIn";
import AsyncEmptyFallback from "../../ui/feedback/fallbacks/defaults/asyncEmptyFallback";

type AsyncStateRendererProps<
  T,
  EmptyMessage extends string = "No data found",
> = {
  state: AsyncState<T, EmptyMessage>;
  children: (data: T) => ReactNode;
  empty?: (message: EmptyMessage) => ReactNode;
  pending?: () => ReactNode;
  initial?: () => ReactNode;
  failed?: (error: string) => ReactElement;
};

export function AsyncStateRenderer<
  T,
  EmptyMessage extends string = "No data found",
>({
  state,
  children,
  empty,
  initial,
  pending,
  failed,
}: AsyncStateRendererProps<T, EmptyMessage>): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return <Fragment>{initial?.() ?? null}</Fragment>;
    }
    case "n/a": {
      const emptyNode = empty ? (
        empty(state.message)
      ) : (
        <AsyncEmptyFallback message={state.message} />
      );

      if (emptyNode == null) return null;

      return <FadeIn keyValue="async-empty-fade-in">{emptyNode}</FadeIn>;
    }
    case "pending": {
      const node = pending ? pending() : <Spinner />;

      if (node == null) return null;

      if (!pending) {
        return <FadeIn keyValue="async-pending-fade-in">{node}</FadeIn>;
      }

      return <FadeIn keyValue="async-pending-fade-in">{node}</FadeIn>;
    }

    case "ready": {
      return <Fragment>{children(state.data)}</Fragment>;
    }
    case "failed": {
      const failedNode = failed ? (
        failed(state.error)
      ) : (
        <AsyncFailedFallback error={state.error} />
      );

      return <FadeIn keyValue="async-failed-fade-in">{failedNode}</FadeIn>;
    }

    default: {
      return assertNever(state);
    }
  }
}

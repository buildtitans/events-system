import type { ReactNode, JSX } from "react";
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
  empty: (message: EmptyMessage) => ReactNode;
  initial?: () => ReactNode;
  failed?: (error: string) => ReactNode;

};

export function AsyncStateRenderer<
  T,
  EmptyMessage extends string = "No date found",
>({
  state,
  children,
  empty,
}: AsyncStateRendererProps<T, EmptyMessage>): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return null;
    }
    case "n/a": {
      return (
        <FadeIn keyValue="async-empty-fade-in">{empty(state.message)}</FadeIn>
      );
    }
    case "pending": {
      return <RelativeSpinner />;
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

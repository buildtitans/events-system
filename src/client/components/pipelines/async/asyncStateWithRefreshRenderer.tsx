import type { AsyncStateWithRefresh } from "@/src/lib/types/state/types";
import type { ReactNode } from "react";
import Spinner from "@/src/client/components/ui/feedback/pending/spinner";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";

type ContentState<T> =
  | { status: "ready"; data: T }
  | { status: "n/a" };

type AsyncStateWithRefreshRendererProps<T, Content> = {
  state: AsyncStateWithRefresh<T>;
  selectContent: (data: T) => ContentState<Content>;
  ready: (data: Content) => ReactNode;
  empty: () => ReactNode;
  pending?: () => ReactNode;
  initial?: () => ReactNode;
  failed?: (error: string) => ReactNode;
};

export default function AsyncStateWithRefreshRenderer<T, Content>({
  state,
  selectContent,
  ready,
  empty,
  pending,
  initial,
  failed,
}: AsyncStateWithRefreshRendererProps<T, Content>): ReactNode {
  switch (state.status) {
    case "initial":
      return initial?.() ?? null;

    case "pending":
    case "refreshing":
      return pending ? pending() : <Spinner />;

    case "failed":
      return failed ? failed(state.error) : <AsyncFailedFallback error={state.error} />;

    case "ready": {
      const content = selectContent(state.data);
      switch (content.status) {
        case "ready":
          return ready(content.data);
        case "n/a":
          return empty();
        default:
          return assertNever(content);
      }
    }

    default:
      return assertNever(state);
  }
}

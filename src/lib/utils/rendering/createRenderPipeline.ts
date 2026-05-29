import type { JSX } from "react";

function createRenderPipeline<
  State extends string,
  Output extends JSX.Element | null,
>(map: Record<State, Output>) {
  return (state: State): Output => {
    const entry = map[state];

    return typeof entry === "function" ? (entry as () => Output)() : entry;
  };
}

export { createRenderPipeline };

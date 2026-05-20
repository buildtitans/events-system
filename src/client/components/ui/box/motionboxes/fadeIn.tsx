import Fade from "@mui/material/Fade";
import { JSX, PropsWithChildren } from "react";
import {
  transitionDurations,
  easeTransition,
} from "@/src/lib/tokens/fadeInTokens";

type FadeInProps = PropsWithChildren<{ keyValue: string }>;

export default function FadeIn({
  children,
  keyValue,
}: FadeInProps): JSX.Element {
  return (
    <Fade
      in={true}
      key={keyValue}
      easing={easeTransition}
      timeout={transitionDurations}
    >
      <div>{children}</div>
    </Fade>
  );
}

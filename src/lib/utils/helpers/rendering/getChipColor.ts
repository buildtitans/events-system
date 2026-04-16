import type { ChipOwnProps } from "@mui/material";

type ChipColor = Pick<ChipOwnProps, "color">;

type GetChipColorParams = {
  condition: boolean;
};

export function getChipColor({
  condition,
}: GetChipColorParams): ChipColor["color"] {
  let color: ChipColor["color"];

  if (condition === true) {
    color = "primary";
  } else {
    color = "default";
  }

  return color;
}

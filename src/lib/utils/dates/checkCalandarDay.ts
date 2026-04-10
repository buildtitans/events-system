import dayjs from "dayjs";
import { CalendarLookup } from "@/src/lib/hooks/hydration/useHydrateCalandar";

type CheckDayArgs = {
  scheduledDateKeys?: CalendarLookup;
  outsideCurrentMonth: boolean;
  day: dayjs.Dayjs;
};

export function checkCalandarDay({
  scheduledDateKeys,
  outsideCurrentMonth,
  day,
}: CheckDayArgs) {
  const dayKey = day.format("YYYY-MM-DD");

  return (
    !outsideCurrentMonth && !!scheduledDateKeys?.get(dayKey)?.has("scheduled")
  );
}

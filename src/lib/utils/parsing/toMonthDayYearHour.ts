import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const MONTH_DAY_YEAR_HOUR_FORMAT = 'MMMM D, YYYY h:mm A';

export function toMonthDayYearHour(date: string): string {
    return dayjs(date).format(MONTH_DAY_YEAR_HOUR_FORMAT);
};
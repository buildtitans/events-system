import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function formatDateForUI(date: string): string {

    const utcDate = dayjs(date).utc().toDate().toLocaleDateString();
    const string_date = dayjs(utcDate).format('MMMM D, YYYY h:mm A');
    return string_date;
};
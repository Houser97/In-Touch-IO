import { DateTime } from "luxon";

export class DateAdapter {
    static convertTimestamp(timestamp: string) {

        const date = new Date(timestamp);
        const currentDate = new Date();

        // Extraer el día, mes y año de ambas fechas
        const messageDay = date.getDate();
        const messageMonth = date.getMonth();
        const messageYear = date.getFullYear();

        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const daysDifference = (currentYear - messageYear) * 365 + (currentMonth - messageMonth) * 30 + (currentDay - messageDay);

        if (daysDifference === 0) {
            return DateTime.fromISO(timestamp).toLocaleString(DateTime.TIME_SIMPLE);
        }
        if (daysDifference === 1) {
            return 'yesterday'
        }
        const dateTime = DateTime.fromISO(timestamp);

        return dateTime.toFormat("MM-dd-yyyy");

    }
}
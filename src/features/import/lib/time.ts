export function formatTime12h(time: string) {
    const [hourValue, minuteValue] = time.split(":");
    const hour = Number(hourValue);
    const minutes = minuteValue ?? "00";

    if (Number.isNaN(hour)) return time;

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${suffix}`;
}
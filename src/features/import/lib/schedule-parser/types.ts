export type ParsedScheduleItem = {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    title: string;
    sourceLine: string;
    confidence: number;
};

export type TimeRangeMatch = {
    startTime: string;
    endTime: string;
    rawStart: string;
    rawEnd: string;
    suspicious: boolean;
};
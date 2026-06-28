import { AputrakScheduleControllerService } from '@/shared/api/generated';

export const scheduleApi = {
    getWeek: (weekId: string) => {
        return AputrakScheduleControllerService.getWeek(weekId);
    },
    updateWeek: (weekId: string, data: any) => {
        return AputrakScheduleControllerService.replaceWeek(weekId, data);
    },
    getSettings: () => {
        return AputrakScheduleControllerService.getSettings();
    },
    updateSettings: (settings: any) => {
        return AputrakScheduleControllerService.updateSettings(settings);
    }
};

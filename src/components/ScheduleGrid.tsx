"use client";
import React from "react";
import { X } from "lucide-react";
import { THEME_COLORS } from "@/lib/constants";
import { Utils } from "@/lib/utils";

interface SettingsType {
  startHour: number;
  endHour: number;
  activeDays: number[];
}

interface ScheduleGridProps {
  settings: SettingsType;
  activities: Record<string, string>;
  weekId: string;
  getDayName: (index: number) => string;
  onCellClick: (day: number, hour: number, activity?: string) => void;
  onDeleteActivity: (day: number, hour: number) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  settings,
  activities,
  weekId,
  getDayName,
  onCellClick,
  onDeleteActivity,
}) => {
  const hoursRange = Array.from(
    { length: settings.endHour - settings.startHour },
    (_, i) => i + settings.startHour,
  );
  const weekDates = Utils.getDatesOfWeek(weekId);

  return (
    <div
      id="schedule-container-wrapper"
      className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 relative"
    >
      <div id="schedule-container" className="min-w-max bg-white">
        <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
          <thead>
            <tr>
              <th className="w-20 bg-white border-b border-r border-slate-200"></th>
              {settings.activeDays.map((dayIdx: number) => (
                <th
                  key={dayIdx}
                  className={`${THEME_COLORS[dayIdx]} text-white font-bold py-3 px-2 text-xs uppercase tracking-wider border border-slate-200 border-t-0`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{getDayName(dayIdx)}</span>
                    <span className="text-[10px] font-medium opacity-90 normal-case tracking-normal">
                      {weekDates[dayIdx]}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hoursRange.map((hour) => (
              <tr key={hour} className="group">
                <td className="w-20 text-center font-semibold text-slate-500 bg-slate-50 border border-slate-200 py-3 text-xs whitespace-nowrap">
                  {Utils.formatTime(hour)}
                </td>

                {settings.activeDays.map((dayIdx: number) => {
                  const key = `${dayIdx}-${hour}`;
                  const activity = activities[key];

                  return (
                    <td
                      key={key}
                      className="border border-slate-200 relative h-16 hover:bg-slate-50 transition-colors cursor-pointer p-1.5"
                      onClick={() => onCellClick(dayIdx, hour, activity)}
                    >
                      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-200 pointer-events-none z-0"></div>

                      {activity && (
                        <div className="relative z-10 w-full h-full min-h-[44px] bg-indigo-50 border border-indigo-200 rounded-md p-1.5 flex items-center justify-center text-center shadow-sm group/item transition-all hover:shadow-md">
                          <span className="text-xs font-bold text-indigo-900 leading-tight line-clamp-2">
                            {activity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteActivity(dayIdx, hour);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity shadow-md hover:bg-red-600 no-print"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

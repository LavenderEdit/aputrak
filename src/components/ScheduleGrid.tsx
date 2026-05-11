"use client";
import React from "react";
import { X, CheckCircle } from "lucide-react";
import { THEME_COLORS, ACTIVITY_COLORS } from "@/lib/constants";
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
  onToggleComplete: (day: number, hour: number, taskIndex: number) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  settings,
  activities,
  weekId,
  getDayName,
  onCellClick,
  onDeleteActivity,
  onToggleComplete,
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

                  let taskText = activity;
                  let colorId = "indigo";
                  let completed: boolean[] = [];

                  if (activity && activity.startsWith("{")) {
                    try {
                      const parsed = JSON.parse(activity);
                      taskText = parsed.text;
                      colorId = parsed.color || "indigo";
                      completed = parsed.completed || [];
                    } catch (e) {
                      // Compatibilidad con texto antiguo
                    }
                  }

                  const tasks = taskText
                    ? taskText.split("\n").filter((t) => t.trim() !== "")
                    : [];
                  const isSingle = tasks.length === 1;
                  const theme =
                    ACTIVITY_COLORS.find((c) => c.id === colorId) ||
                    ACTIVITY_COLORS[0];

                  return (
                    <td
                      key={key}
                      className="border border-slate-200 relative h-16 hover:bg-slate-50 transition-colors cursor-pointer p-1.5 align-top"
                      onClick={() => onCellClick(dayIdx, hour, activity)}
                    >
                      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-200 pointer-events-none z-0"></div>

                      {tasks.length > 0 && (
                        <div
                          className={`relative z-10 w-full h-full min-h-[44px] ${theme.bg} border ${theme.border} rounded-md shadow-sm group/item transition-all hover:shadow-md flex ${
                            isSingle
                              ? "items-center justify-center p-1.5 text-center"
                              : "flex-col gap-1 p-2 justify-start"
                          }`}
                        >
                          {isSingle ? (
                            <div className="flex items-center justify-center gap-1.5 w-full relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(dayIdx, hour, 0);
                                }}
                                className={`shrink-0 transition-all z-20 ${
                                  completed[0]
                                    ? "text-emerald-500 opacity-100"
                                    : "text-slate-400 opacity-0 group-hover/item:opacity-100 hover:text-emerald-500 hover:scale-110"
                                }`}
                                title="Marcar como completado"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <span
                                className={`text-xs font-bold ${theme.text} leading-tight line-clamp-2 transition-all ${
                                  completed[0] ? "line-through opacity-40" : ""
                                }`}
                              >
                                {tasks[0]}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5 w-full">
                              {tasks.map((task, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-1.5 text-left w-full group/task"
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleComplete(dayIdx, hour, i);
                                    }}
                                    className={`mt-0.5 shrink-0 transition-all z-20 ${
                                      completed[i]
                                        ? "text-emerald-500 opacity-100"
                                        : "text-slate-400 opacity-0 group-hover/item:opacity-100 hover:text-emerald-500 hover:scale-110"
                                    }`}
                                  >
                                    <CheckCircle size={12} />
                                  </button>
                                  <span
                                    className={`text-[10px] font-bold ${theme.text} leading-tight break-words flex-1 line-clamp-2 transition-all ${
                                      completed[i]
                                        ? "line-through opacity-40"
                                        : ""
                                    }`}
                                  >
                                    {task}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteActivity(dayIdx, hour);
                            }}
                            className="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity shadow-md hover:bg-red-600 no-print"
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

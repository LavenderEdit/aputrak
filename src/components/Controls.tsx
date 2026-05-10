"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { Utils } from "@/lib/utils";

interface SettingsType {
  activeDays: number[];
  startHour: number;
  endHour: number;
}

interface ControlsProps {
  settings: SettingsType;
  updateSettings: (newSettings: SettingsType) => void;
  weekId: string;
  changeWeek: (direction: number) => void;
  t: (key: any) => string;
  getDayName: (index: number) => string;
}

export const Controls: React.FC<ControlsProps> = ({
  settings,
  updateSettings,
  weekId,
  changeWeek,
  t,
  getDayName,
}) => {
  const toggleDay = (index: number) => {
    let newDays = [...settings.activeDays];
    if (newDays.includes(index)) {
      if (newDays.length > 1) newDays = newDays.filter((d) => d !== index);
    } else {
      newDays.push(index);
      newDays.sort((a, b) => a - b);
    }
    updateSettings({ ...settings, activeDays: newDays });
  };

  const handleHourChange = (type: "start" | "end", val: string) => {
    let newStart = type === "start" ? parseInt(val) : settings.startHour;
    let newEnd = type === "end" ? parseInt(val) : settings.endHour;

    if (newStart >= newEnd) {
      if (type === "start") newStart = Math.max(0, newEnd - 1);
      else newEnd = Math.min(24, newStart + 1);
    }
    updateSettings({ ...settings, startHour: newStart, endHour: newEnd });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 no-print grid grid-cols-1 lg:grid-cols-3 gap-6 border border-slate-100">
      <div className="col-span-1 lg:border-r lg:border-slate-100 lg:pr-6">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {t("weekNav")}
        </label>
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1.5 border border-slate-200">
          <button
            onClick={() => changeWeek(-1)}
            className="p-1.5 hover:bg-white rounded text-slate-600 shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-sm text-slate-700">
            {getDayName(0)} {weekId.split("-").reverse().join("/")}
          </span>
          <button
            onClick={() => changeWeek(1)}
            className="p-1.5 hover:bg-white rounded text-slate-600 shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {t("activeDays")}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DAYS_OF_WEEK.map((_, idx) => (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                  settings.activeDays.includes(idx)
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {getDayName(idx).slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {t("startHour")}
            </label>
            <select
              value={settings.startHour}
              onChange={(e) => handleHourChange("start", e.target.value)}
              className="w-full border-slate-200 rounded-md p-2 text-sm bg-slate-50 font-medium"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {Utils.formatTime(i)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {t("endHour")}
            </label>
            <select
              value={settings.endHour}
              onChange={(e) => handleHourChange("end", e.target.value)}
              className="w-full border-slate-200 rounded-md p-2 text-sm bg-slate-50 font-medium"
            >
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i} value={i}>
                  {Utils.formatTime(i)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

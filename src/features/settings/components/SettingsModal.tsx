"use client";
import React from "react";
import { X } from "lucide-react";
import { DAYS_OF_WEEK } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import type { TranslateFn } from "@/shared/types/i18n.types";

interface SettingsType {
  activeDays: number[];
  startHour: number;
  endHour: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  updateSettings: (newSettings: SettingsType) => void;
  t: TranslateFn;
  getDayName: (index: number) => string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  t,
  getDayName,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{t("settings")}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Días Activos */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {t("activeDays")}
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${settings.activeDays.includes(idx)
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  {getDayName(idx).slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Horas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t("startHour")}
              </label>
              <select
                value={settings.startHour}
                onChange={(e) => handleHourChange("start", e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm bg-white font-medium focus:outline-none focus:border-indigo-500"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {Utils.formatTime(i)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t("endHour")}
              </label>
              <select
                value={settings.endHour}
                onChange={(e) => handleHourChange("end", e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm bg-white font-medium focus:outline-none focus:border-indigo-500"
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

        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

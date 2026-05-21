"use client";

import { DAYS_OF_WEEK } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
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

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
  t,
  getDayName,
}: SettingsModalProps) {
  const toggleDay = (index: number) => {
    let newDays = [...settings.activeDays];

    if (newDays.includes(index)) {
      if (newDays.length > 1) {
        newDays = newDays.filter((day) => day !== index);
      }
    } else {
      newDays.push(index);
      newDays.sort((a, b) => a - b);
    }

    updateSettings({ ...settings, activeDays: newDays });
  };

  const handleHourChange = (type: "start" | "end", value: string) => {
    let newStart = type === "start" ? Number(value) : settings.startHour;
    let newEnd = type === "end" ? Number(value) : settings.endHour;

    if (newStart >= newEnd) {
      if (type === "start") {
        newStart = Math.max(0, newEnd - 1);
      } else {
        newEnd = Math.min(24, newStart + 1);
      }
    }

    updateSettings({
      ...settings,
      startHour: newStart,
      endHour: newEnd,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("settings")}>
      <div className="space-y-6 p-6">
        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("activeDays")}
          </label>

          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((_, index) => (
              <button
                key={index}
                onClick={() => toggleDay(index)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${settings.activeDays.includes(index)
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
              >
                {getDayName(index).slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("startHour")}
            </label>

            <select
              value={settings.startHour}
              onChange={(event) => handleHourChange("start", event.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white p-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none"
            >
              {Array.from({ length: 24 }, (_, index) => (
                <option key={index} value={index}>
                  {Utils.formatTime(index)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("endHour")}
            </label>

            <select
              value={settings.endHour}
              onChange={(event) => handleHourChange("end", event.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white p-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none"
            >
              {Array.from({ length: 25 }, (_, index) => (
                <option key={index} value={index}>
                  {Utils.formatTime(index)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-slate-50 px-6 py-4">
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    </Modal>
  );
}
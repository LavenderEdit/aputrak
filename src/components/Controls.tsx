"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";

interface ControlsProps {
  weekId: string;
  changeWeek: (direction: number) => void;
  onOpenSettings: () => void;
  t: (key: any) => string;
  getDayName: (index: number) => string;
}

export const Controls: React.FC<ControlsProps> = ({
  weekId,
  changeWeek,
  onOpenSettings,
  t,
  getDayName,
}) => {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm mb-4 no-print flex items-center justify-between border border-slate-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
          <button
            onClick={() => changeWeek(-1)}
            className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-indigo-600 hover:shadow-sm transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-sm text-slate-700 px-3 min-w-[140px] text-center">
            {getDayName(0)} {weekId.split("-").reverse().join("/")}
          </span>
          <button
            onClick={() => changeWeek(1)}
            className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-indigo-600 hover:shadow-sm transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={onOpenSettings}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-200"
      >
        <Settings size={16} />
        <span className="hidden sm:inline">{t("settings")}</span>
      </button>
    </div>
  );
};

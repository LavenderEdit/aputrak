"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Clock, Calendar as CalendarIcon } from "lucide-react";
import { ACTIVITY_COLORS } from "../../../shared/lib/constants";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    text: string;
    color: string;
    startMinute: number;
    endMinute: number;
    day: number;
  }) => void;
  dayIdx: number;
  initialText?: string;
  initialColor?: string;
  initialStartMinute?: number;
  initialEndMinute?: number;
  getDayName: (idx: number) => string;
  t: (key: any) => string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayIdx,
  initialText,
  initialColor,
  initialStartMinute,
  initialEndMinute,
  getDayName,
  t,
}) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("indigo");
  const [day, setDay] = useState(dayIdx);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const formatTimeForInput = (m: number) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isOpen) {
      setText(initialText || "");
      setColor(initialColor || "indigo");
      setDay(dayIdx);
      setStartTime(
        initialStartMinute !== undefined
          ? formatTimeForInput(initialStartMinute)
          : "08:00",
      );
      setEndTime(
        initialEndMinute !== undefined
          ? formatTimeForInput(initialEndMinute)
          : "09:00",
      );
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [
    isOpen,
    initialText,
    initialColor,
    initialStartMinute,
    initialEndMinute,
    dayIdx,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    let startMinute = sH * 60 + sM;
    let endMinute = eH * 60 + eM;

    if (endMinute <= startMinute) endMinute = startMinute + 60;
    onSave({ text, color, startMinute, endMinute, day });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon size={18} />
            {t("activity")}
          </h3>
          <button
            onClick={onClose}
            className="text-indigo-100 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500 uppercase w-12">
                {t("day")}
              </label>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 w-full text-sm">
                {getDayName(day)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 w-12 shrink-0">
                <Clock size={12} /> {t("timeRange")}
              </label>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 w-full"
                  required
                />
                <span className="text-slate-400 font-medium">-</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 w-full"
                  required
                />
              </div>
            </div>
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 mb-4 font-medium text-slate-800 resize-none h-24"
            placeholder={t("taskPlaceholder")}
          />
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-3 font-medium">
              {t("colorCategory")}
            </p>
            <div className="flex gap-3">
              {ACTIVITY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.picker} transition-all ${color === c.id ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "opacity-60 hover:opacity-100 hover:scale-105"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {t("saveTask")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { ACTIVITY_COLORS } from "@/shared/lib/constants";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import type { TranslateFn } from "@/shared/types/i18n.types";

interface ActivityPayload {
  text: string;
  color: string;
  startMinute: number;
  endMinute: number;
  day: number;
}

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: ActivityPayload) => void;
  dayIdx: number;
  initialText?: string;
  initialColor?: string;
  initialStartMinute?: number;
  initialEndMinute?: number;
  getDayName: (idx: number) => string;
  t: TranslateFn;
}

type ActivityFormProps = Omit<ActivityModalProps, "isOpen">;

function formatTimeForInput(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function ActivityForm({
  onClose,
  onSave,
  dayIdx,
  initialText = "",
  initialColor = "indigo",
  initialStartMinute,
  initialEndMinute,
  getDayName,
  t,
}: ActivityFormProps) {
  const [text, setText] = useState(initialText);
  const [color, setColor] = useState(initialColor);
  const [day] = useState(dayIdx);
  const [startTime, setStartTime] = useState(
    initialStartMinute !== undefined
      ? formatTimeForInput(initialStartMinute)
      : "08:00",
  );
  const [endTime, setEndTime] = useState(
    initialEndMinute !== undefined
      ? formatTimeForInput(initialEndMinute)
      : "09:00",
  );

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const [startHour, startMinutes] = startTime.split(":").map(Number);
    const [endHour, endMinutes] = endTime.split(":").map(Number);

    const startMinute = startHour * 60 + startMinutes;
    const rawEndMinute = endHour * 60 + endMinutes;
    const endMinute =
      rawEndMinute <= startMinute ? startMinute + 60 : rawEndMinute;

    onSave({
      text,
      color,
      startMinute,
      endMinute,
      day,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <label className="w-12 text-xs font-bold uppercase text-slate-500">
            {t("day")}
          </label>

          <span className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">
            {getDayName(day)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex w-12 shrink-0 items-center gap-1 text-xs font-bold uppercase text-slate-500">
            <Clock size={12} />
            {t("timeRange")}
          </label>

          <div className="flex w-full items-center gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
              required
            />

            <span className="font-medium text-slate-400">-</span>

            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      <textarea
        ref={inputRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mb-4 h-24 w-full resize-none rounded-xl border-2 border-slate-200 p-3 font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
        placeholder={t("taskPlaceholder")}
      />

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-slate-500">
          {t("colorCategory")}
        </p>

        <div className="flex gap-3">
          {ACTIVITY_COLORS.map((activityColor) => (
            <button
              key={activityColor.id}
              type="button"
              onClick={() => setColor(activityColor.id)}
              className={`h-8 w-8 rounded-full ${activityColor.picker} transition-all ${color === activityColor.id
                ? "scale-110 ring-2 ring-indigo-500 ring-offset-2"
                : "opacity-60 hover:scale-105 hover:opacity-100"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Button>

        <Button type="submit">{t("saveTask")}</Button>
      </div>
    </form>
  );
}

export function ActivityModal({
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
}: ActivityModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("activity")}
      className="max-w-md"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 text-sm font-bold text-indigo-700">
        {t("activity")}
      </div>

      <ActivityForm
        key={[
          dayIdx,
          initialText,
          initialColor,
          initialStartMinute,
          initialEndMinute,
        ].join("-")}
        onClose={onClose}
        onSave={onSave}
        dayIdx={dayIdx}
        initialText={initialText}
        initialColor={initialColor}
        initialStartMinute={initialStartMinute}
        initialEndMinute={initialEndMinute}
        getDayName={getDayName}
        t={t}
      />
    </Modal>
  );
}
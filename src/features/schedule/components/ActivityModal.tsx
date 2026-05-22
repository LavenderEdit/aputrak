"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Palette } from "lucide-react";
import { ACTIVITY_COLORS } from "@/shared/lib/constants";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { getScheduleCopy } from "../constants/schedule.constants";

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
  lang: string;
}

type ActivityFormProps = Omit<ActivityModalProps, "isOpen">;

function formatTimeForInput(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function splitInitialText(value: string) {
  const lines = value.split("\n");

  return {
    title: lines[0] ?? "",
    notes: lines.slice(1).join("\n"),
  };
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
  lang,
}: ActivityFormProps) {
  const copy = getScheduleCopy(lang);
  const initial = splitInitialText(initialText);

  const [title, setTitle] = useState(initial.title);
  const [notes, setNotes] = useState(initial.notes);
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

  const inputRef = useRef<HTMLInputElement>(null);

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

    const text = [title.trim(), notes.trim()].filter(Boolean).join("\n");

    onSave({
      text,
      color,
      startMinute,
      endMinute,
      day,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {copy.activityTitle}
        </label>

        <input
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder={copy.titlePlaceholder}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">
            {copy.day}
          </label>

          <div className="rounded-xl border border-sborder bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
            {getDayName(day)}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Clock size={15} />
            {copy.timeRange}
          </label>

          <div className="flex items-center gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              required
            />

            <span className="text-muted">-</span>

            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {copy.notes}
        </label>

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="h-24 w-full resize-none rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder={copy.notesPlaceholder}
        />
      </div>

      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-800">
          <Palette size={15} />
          {copy.colorCategory}
        </label>

        <div className="flex flex-wrap gap-3">
          {ACTIVITY_COLORS.map((activityColor) => (
            <button
              key={activityColor.id}
              type="button"
              onClick={() => setColor(activityColor.id)}
              className={`h-9 w-9 rounded-full ${activityColor.picker} transition-all ${color === activityColor.id
                ? "scale-110 ring-2 ring-primary ring-offset-2"
                : "opacity-70 hover:scale-105 hover:opacity-100"
                }`}
              aria-label={activityColor.id}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-sborder pt-5">
        <Button variant="ghost" onClick={onClose}>
          {copy.cancel}
        </Button>

        <Button type="submit">{copy.saveTask}</Button>
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
  lang,
}: ActivityModalProps) {
  const copy = getScheduleCopy(lang);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.activityTitle}
      className="max-w-lg"
    >
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
        lang={lang}
      />
    </Modal>
  );
}
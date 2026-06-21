"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { Select } from "@/shared/components/ui/Select";
import { Textarea } from "@/shared/components/ui/Textarea";
import { cn } from "@/shared/lib/cn";
import {
  DEFAULT_ACTIVITY_TAGS,
  GENERAL_TAG_ID,
} from "@/features/tags/constants/tags.constants";
import type { ActivityTag } from "@/features/tags/types/tag.types";
import { getScheduleCopy } from "../constants/schedule.constants";
import { DAYS_IN_WEEK, MINUTES_IN_HOUR } from "@/shared/lib/constants";

interface ActivityPayload {
  text: string;
  tagId: string;
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
  initialTagId?: string;
  initialColor?: string;
  initialStartMinute?: number;
  initialEndMinute?: number;
  tags?: ActivityTag[];
  getDayName: (idx: number) => string;
  lang: string;
}

type ActivityFormProps = Omit<ActivityModalProps, "isOpen">;

function formatTimeForInput(minutes: number) {
  const hour = Math.floor(minutes / MINUTES_IN_HOUR);
  const minute = minutes % MINUTES_IN_HOUR;

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

function getFallbackTag(tags: ActivityTag[]) {
  return (
    tags.find((tag) => tag.id === GENERAL_TAG_ID) ??
    tags[0] ??
    DEFAULT_ACTIVITY_TAGS[0]
  );
}

function ActivityForm({
  onClose,
  onSave,
  dayIdx,
  initialText = "",
  initialTagId,
  initialStartMinute,
  initialEndMinute,
  tags = DEFAULT_ACTIVITY_TAGS,
  getDayName,
  lang,
}: ActivityFormProps) {
  const copy = getScheduleCopy(lang);
  const initial = splitInitialText(initialText);
  const fallbackTag = getFallbackTag(tags);

  const [title, setTitle] = useState(initial.title);
  const [notes, setNotes] = useState(initial.notes);
  const [tagId, setTagId] = useState(initialTagId ?? fallbackTag.id);
  const [day, setDay] = useState(dayIdx);

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

  const selectedTag = useMemo(() => {
    return tags.find((tag) => tag.id === tagId) ?? fallbackTag;
  }, [fallbackTag, tagId, tags]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const [startHour, startMinutes] = startTime.split(":").map(Number);
    const [endHour, endMinutes] = endTime.split(":").map(Number);

    const startMinute = startHour * MINUTES_IN_HOUR + startMinutes;
    const rawEndMinute = endHour * MINUTES_IN_HOUR + endMinutes;
    const endMinute =
      rawEndMinute <= startMinute ? startMinute + MINUTES_IN_HOUR : rawEndMinute;

    const text = [title.trim(), notes.trim()].filter(Boolean).join("\n");

    if (!text.trim()) return;

    onSave({
      text,
      tagId: selectedTag.id,
      color: selectedTag.color,
      startMinute,
      endMinute,
      day,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
      <div>
        <label htmlFor="activity-title" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-black">
          {copy.activityTitle}
        </label>

        <Input
          id="activity-title"
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={copy.titlePlaceholder}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="activity-day" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-black">
            {copy.day}
          </label>

          <Select
            id="activity-day"
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
          >
            {Array.from({ length: DAYS_IN_WEEK }, (_, index) => (
              <option key={index} value={index}>
                {getDayName(index)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="activity-start-time" className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black">
            <Clock size={15} />
            {copy.timeRange}
          </label>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <Input
              id="activity-start-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
              className="px-2"
              aria-label={lang === "es" ? "Hora de inicio" : "Start time"}
            />

            <span className="font-black text-black">-</span>

            <Input
              id="activity-end-time"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
              className="px-2"
              aria-label={lang === "es" ? "Hora de fin" : "End time"}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black">
          <Tag size={15} />
          {lang === "es" ? "Etiqueta" : "Tag"}
        </label>

        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
          {tags.map((tag) => {
            const active = tag.id === selectedTag.id;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setTagId(tag.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  active
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: tag.color }}
                />

                <span className="min-w-0 truncate">
                  {tag.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="activity-notes" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-black">
          {copy.notes}
        </label>

        <Textarea
          id="activity-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="h-24"
          placeholder={copy.notesPlaceholder}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
        <div className="flex items-center gap-3">
          <span
            className="h-8 w-8 rounded-lg border border-black/10 shadow-sm"
            style={{ backgroundColor: selectedTag.color }}
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {selectedTag.name}
            </p>

            <p className="text-[11px] font-medium text-slate-500">
              {lang === "es"
                ? "El color de la actividad viene de la etiqueta seleccionada."
                : "Activity color is inherited from the selected tag."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-slate-200/60 pt-5 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="w-full"
        >
          {copy.cancel}
        </Button>

        <Button type="submit" className="w-full">
          {copy.saveTask}
        </Button>
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
  initialTagId,
  initialColor,
  initialStartMinute,
  initialEndMinute,
  tags = DEFAULT_ACTIVITY_TAGS,
  getDayName,
  lang,
}: ActivityModalProps) {
  const copy = getScheduleCopy(lang);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.activityTitle}
      className="max-w-xl"
    >
      <ActivityForm
        key={[
          dayIdx,
          initialText,
          initialTagId,
          initialColor,
          initialStartMinute,
          initialEndMinute,
          tags.map((tag) => tag.id).join("_"),
        ].join("-")}
        onClose={onClose}
        onSave={onSave}
        dayIdx={dayIdx}
        initialText={initialText}
        initialTagId={initialTagId}
        initialColor={initialColor}
        initialStartMinute={initialStartMinute}
        initialEndMinute={initialEndMinute}
        tags={tags}
        getDayName={getDayName}
        lang={lang}
      />
    </Modal>
  );
}
"use client";

import type { ParsedScheduleItem } from "../lib/scheduleParser";
import { getImportCopy } from "../constants/import.constants";
import { formatTime12h } from "../lib/time";

interface SnapPlanDetectedTableProps {
    lang: string;
    items: ParsedScheduleItem[];
    isSaving: boolean;
    canConfirm: boolean;
    onUpdateItem: (id: string, patch: Partial<ParsedScheduleItem>) => void;
    onRemoveItem: (id: string) => void;
    onConfirm: () => void;
}

const SCHEDULE_DAYS = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Revisar día",
];

export function SnapPlanDetectedTable({
    lang,
    items,
    isSaving,
    canConfirm,
    onUpdateItem,
    onRemoveItem,
    onConfirm,
}: SnapPlanDetectedTableProps) {
    const copy = getImportCopy(lang);

    if (items.length === 0) return null;

    return (
        <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-bold text-slate-950">
                    {copy.detectedActivitiesTitle}
                </h3>

                <span className="text-sm text-muted">
                    {items.length}{" "}
                    {items.length === 1 ? copy.results : copy.resultsPlural}
                </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sborder">
                <table className="w-full min-w-[760px] border-collapse bg-white text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-3 py-3 font-medium">
                                {copy.day}
                            </th>
                            <th className="px-3 py-3 font-medium">
                                {copy.start}
                            </th>
                            <th className="px-3 py-3 font-medium">
                                {copy.end}
                            </th>
                            <th className="px-3 py-3 font-medium">
                                {copy.activity}
                            </th>
                            <th className="px-3 py-3 font-medium">
                                {copy.action}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-t border-slate-100">
                                <td className="px-3 py-2">
                                    <select
                                        value={item.day}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                day: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-sborder bg-white px-2 py-1.5 outline-none transition focus:border-primary"
                                    >
                                        {SCHEDULE_DAYS.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="px-3 py-2">
                                    <input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                startTime: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-sborder bg-white px-2 py-1.5 outline-none transition focus:border-primary"
                                    />

                                    <p className="mt-1 text-xs text-muted">
                                        {formatTime12h(item.startTime)}
                                    </p>
                                </td>

                                <td className="px-3 py-2">
                                    <input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                endTime: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-sborder bg-white px-2 py-1.5 outline-none transition focus:border-primary"
                                    />

                                    <p className="mt-1 text-xs text-muted">
                                        {formatTime12h(item.endTime)}
                                    </p>
                                </td>

                                <td className="px-3 py-2">
                                    <input
                                        value={item.title}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                title: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-sborder bg-white px-2 py-1.5 outline-none transition focus:border-primary"
                                    />
                                </td>

                                <td className="px-3 py-2">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(item.id)}
                                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-red-50"
                                    >
                                        {copy.remove}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={!canConfirm || isSaving}
                    className="rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSaving ? copy.saving : copy.confirmDetectedActivities}
                </button>
            </div>
        </div>
    );
}
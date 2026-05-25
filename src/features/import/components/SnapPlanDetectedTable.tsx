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

function FieldLabel({ children }: { children: string }) {
    return (
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            {children}
        </label>
    );
}

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
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-base font-bold text-slate-950">
                    {copy.detectedActivitiesTitle}
                </h3>

                <span className="text-sm text-muted">
                    {items.length}{" "}
                    {items.length === 1 ? copy.results : copy.resultsPlural}
                </span>
            </div>

            <div className="space-y-3 md:hidden">
                {items.map((item, index) => (
                    <article
                        key={item.id}
                        className="rounded-2xl border border-sborder bg-white p-4 shadow-sm"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                    #{index + 1}
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-950">
                                    {item.title || copy.untitledActivity}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger transition hover:bg-red-50"
                            >
                                {copy.remove}
                            </button>
                        </div>

                        <div className="grid gap-3">
                            <div>
                                <FieldLabel>{copy.day}</FieldLabel>
                                <select
                                    value={item.day}
                                    onChange={(event) =>
                                        onUpdateItem(item.id, {
                                            day: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                                >
                                    {SCHEDULE_DAYS.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FieldLabel>{copy.start}</FieldLabel>
                                    <input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                startTime: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                                    />
                                    <p className="mt-1 text-xs text-muted">
                                        {formatTime12h(item.startTime)}
                                    </p>
                                </div>

                                <div>
                                    <FieldLabel>{copy.end}</FieldLabel>
                                    <input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                endTime: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                                    />
                                    <p className="mt-1 text-xs text-muted">
                                        {formatTime12h(item.endTime)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <FieldLabel>{copy.activity}</FieldLabel>
                                <input
                                    value={item.title}
                                    onChange={(event) =>
                                        onUpdateItem(item.id, {
                                            title: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                                />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-sborder md:block">
                <table className="w-full min-w-[760px] border-collapse bg-white text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-3 py-3 font-medium">{copy.day}</th>
                            <th className="px-3 py-3 font-medium">{copy.start}</th>
                            <th className="px-3 py-3 font-medium">{copy.end}</th>
                            <th className="px-3 py-3 font-medium">{copy.activity}</th>
                            <th className="px-3 py-3 font-medium">{copy.action}</th>
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

            <div className="sticky bottom-24 z-20 -mx-4 mt-4 border-t border-sborder bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                <div className="flex justify-stretch sm:justify-end">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!canConfirm || isSaving}
                        className="w-full rounded-xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto sm:py-2.5"
                    >
                        {isSaving ? copy.saving : copy.confirmDetectedActivities}
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
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
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
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
            <div className="mb-4 flex flex-col gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-xl font-black uppercase tracking-tight text-black">
                    {copy.detectedActivitiesTitle}
                </h3>

                <span className="w-fit border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-black">
                    {items.length}{" "}
                    {items.length === 1 ? copy.results : copy.resultsPlural}
                </span>
            </div>

            <div className="space-y-4 md:hidden">
                {items.map((item, index) => (
                    <article
                        key={item.id}
                        className="border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#000]"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3 border-b-2 border-black pb-3">
                            <div className="min-w-0">
                                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                                    #{index + 1}
                                </p>

                                <p className="mt-1 truncate text-sm font-black uppercase tracking-[0.06em] text-black">
                                    {item.title || copy.untitledActivity}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-white text-black transition hover:bg-red-600 hover:text-white"
                                aria-label={copy.remove}
                            >
                                <Trash2 size={15} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="grid gap-3">
                            <div>
                                <FieldLabel>{copy.day}</FieldLabel>

                                <Select
                                    value={item.day}
                                    onChange={(event) =>
                                        onUpdateItem(item.id, {
                                            day: event.target.value,
                                        })
                                    }
                                >
                                    {SCHEDULE_DAYS.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FieldLabel>{copy.start}</FieldLabel>

                                    <Input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                startTime: event.target.value,
                                            })
                                        }
                                        className="px-2"
                                    />

                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {formatTime12h(item.startTime)}
                                    </p>
                                </div>

                                <div>
                                    <FieldLabel>{copy.end}</FieldLabel>

                                    <Input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                endTime: event.target.value,
                                            })
                                        }
                                        className="px-2"
                                    />

                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {formatTime12h(item.endTime)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <FieldLabel>{copy.activity}</FieldLabel>

                                <Input
                                    value={item.title}
                                    onChange={(event) =>
                                        onUpdateItem(item.id, {
                                            title: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto border-[3px] border-black bg-white shadow-[5px_5px_0_#000] md:block">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                    <thead className="bg-[#F5F0E6] text-left">
                        <tr className="border-b-[3px] border-black">
                            <th className="border-r-2 border-black px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                                {copy.day}
                            </th>
                            <th className="border-r-2 border-black px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                                {copy.start}
                            </th>
                            <th className="border-r-2 border-black px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                                {copy.end}
                            </th>
                            <th className="border-r-2 border-black px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                                {copy.activity}
                            </th>
                            <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                                {copy.action}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b-2 border-black last:border-b-0">
                                <td className="border-r-2 border-black px-3 py-3">
                                    <Select
                                        value={item.day}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                day: event.target.value,
                                            })
                                        }
                                        className="py-2"
                                    >
                                        {SCHEDULE_DAYS.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </Select>
                                </td>

                                <td className="border-r-2 border-black px-3 py-3">
                                    <Input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                startTime: event.target.value,
                                            })
                                        }
                                        className="py-2"
                                    />

                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {formatTime12h(item.startTime)}
                                    </p>
                                </td>

                                <td className="border-r-2 border-black px-3 py-3">
                                    <Input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                endTime: event.target.value,
                                            })
                                        }
                                        className="py-2"
                                    />

                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {formatTime12h(item.endTime)}
                                    </p>
                                </td>

                                <td className="border-r-2 border-black px-3 py-3">
                                    <Input
                                        value={item.title}
                                        onChange={(event) =>
                                            onUpdateItem(item.id, {
                                                title: event.target.value,
                                            })
                                        }
                                        className="py-2"
                                    />
                                </td>

                                <td className="px-3 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(item.id)}
                                        className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-red-600 hover:text-white"
                                    >
                                        <Trash2 size={14} strokeWidth={3} />
                                        {copy.remove}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 border-[3px] border-black bg-[#FFFCF4] p-4 shadow-[5px_5px_0_#000]">
                <div className="flex justify-stretch sm:justify-end">
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={!canConfirm || isSaving}
                        className="w-full sm:w-auto"
                    >
                        {isSaving ? copy.saving : copy.confirmDetectedActivities}
                    </Button>
                </div>
            </div>
        </div>
    );
}
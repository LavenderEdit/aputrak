"use client";

import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { getScheduleCopy } from "../constants/schedule.constants";
interface ScheduleControlsProps {
    weekId: string;
    lang: string;
    changeWeek: (direction: number) => void;
    onOpenSettings: () => void;
}

export function ScheduleControls({
    weekId,
    lang,
    changeWeek,
    onOpenSettings,
}: ScheduleControlsProps) {
    const copy = getScheduleCopy(lang);
    return (
        <Card className="no-print p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {copy.week}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-950">{weekId}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => changeWeek(-1)}
                        className="h-10 w-10 px-0"
                    >
                        <ChevronLeft size={18} />
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => changeWeek(1)}
                        className="h-10 w-10 px-0"
                    >
                        <ChevronRight size={18} />
                    </Button>

                    <Button variant="primary" size="md" onClick={onOpenSettings}>
                        <Settings size={16} />
                        {copy.settings}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
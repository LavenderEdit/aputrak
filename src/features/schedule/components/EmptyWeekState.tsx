"use client";

import { CalendarPlus, Copy, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import type { TranslateFn } from "@/shared/types/i18n.types";

interface EmptyWeekStateProps {
    t: TranslateFn;
    onCreateTask: () => void;
    onCopyPreviousWeek: () => Promise<void>;
}

export function EmptyWeekState({
    t,
    onCreateTask,
    onCopyPreviousWeek,
}: EmptyWeekStateProps) {
    return (
        <Card className="border-indigo-100 bg-indigo-50/80 p-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                <CalendarPlus className="text-indigo-600" size={32} />
            </div>

            <h3 className="text-xl font-black text-indigo-950">
                {t("emptyTitle")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-indigo-700/80">
                {t("emptyDesc")}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={onCreateTask} size="lg">
                    <Plus size={18} />
                    {t("activity")}
                </Button>

                <Button onClick={onCopyPreviousWeek} variant="secondary" size="lg">
                    <Copy size={18} />
                    {t("cloneWeek")}
                </Button>
            </div>
        </Card>
    );
}
"use client";

import { useMemo, useState } from "react";
import { ActivitiesView } from "@/features/activities/components/ActivitiesView";
import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { useOfflineAuth } from "@/features/auth/hooks/useOfflineAuth";
import { CalendarView } from "@/features/calendar/components/CalendarView";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { ExportView } from "@/features/export/components/ExportView";
import { useScheduleExport } from "@/features/export/hooks/useScheduleExport";
import { ImportView } from "@/features/import/components/ImportView";
import { useScheduleImport } from "@/features/import/hooks/useScheduleImageImport";
import { ActivityModal } from "@/features/schedule/components/ActivityModal";
import { useActivityModal } from "@/features/schedule/hooks/useActivityModal";
import { useOfflineSchedule } from "@/features/schedule/hooks/useOfflineSchedule";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { SettingsView } from "@/features/settings/components/SettingsView";
import { TagsView } from "@/features/tags/components/TagsView";
import { getToastCopy } from "@/shared/constants/toast.constants";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { useToast } from "@/shared/hooks/useToast";
import { cn } from "@/shared/lib/cn";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { MobileNav } from "./MobileNav";
import type { AppView } from "../types/shell.types";

function createTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getCompletedState(text: string, previous: boolean[] = []) {
    const count = text.split("\n").filter((line) => line.trim()).length;

    return Array.from({ length: count }, (_, index) => previous[index] ?? false);
}

export function AppShell() {
    const { profile, saveUsername, loadingAuth } = useOfflineAuth();
    const scheduleData = useOfflineSchedule();
    const { lang, toggleLanguage, t, getDayName } = useLanguage();
    const { showToast, showPromiseToast } = useToast();
    const toastCopy = getToastCopy(lang);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState<AppView>("dashboard");

    const firstActiveDay = useMemo(
        () => scheduleData.settings.activeDays[0] ?? 0,
        [scheduleData.settings.activeDays],
    );

    const { modalState, openCreateModal, openEditModal, closeModal } =
        useActivityModal(firstActiveDay, scheduleData.settings.startHour);

    const { handleGraphicExport, handleExportJSON } = useScheduleExport({
        profile,
        scheduleData,
        lang,
        showPromiseToast,
    });

    const { handleImportJSON } = useScheduleImport({
        scheduleData,
        lang,
        showPromiseToast,
    });

    if (loadingAuth) {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50">
                <div className="h-11 w-11 animate-spin rounded-full border-2 border-indigo-100 border-b-indigo-600" />
            </main>
        );
    }

    if (!profile?.username) {
        return <LoginScreen onSave={saveUsername} />;
    }

    const renderActiveView = () => {
        if (activeView === "dashboard") {
            return (
                <DashboardOverview
                    lang={lang}
                    username={profile.username}
                    t={t}
                    tasks={scheduleData.tasks}
                    settings={scheduleData.settings}
                    loadingData={scheduleData.loadingData}
                    onCreateTask={() => openCreateModal()}
                    onOpenCalendar={() => setActiveView("calendar")}
                    onOpenImport={() => setActiveView("import")}
                    onOpenExport={() => setActiveView("export")}
                    onCopyPreviousWeek={async () => {
                        const success = await scheduleData.copyPreviousWeek();

                        showToast(
                            success
                                ? toastCopy.schedule.cloneSuccess
                                : toastCopy.schedule.cloneError,
                            success ? "success" : "error",
                        );
                    }}
                    onSmartReschedule={async () => {
                        const result = await scheduleData.smartReschedule();

                        if (result.success) {
                            showToast(toastCopy.schedule.smartRescheduleSuccess);
                            return;
                        }

                        if (result.reason === "no-space") {
                            showToast(toastCopy.schedule.smartRescheduleNoSpace, "error");
                        }
                    }}
                />
            );
        }

        if (activeView === "calendar") {
            return (
                <CalendarView
                    lang={lang}
                    weekId={scheduleData.weekId}
                    settings={scheduleData.settings}
                    tasks={scheduleData.tasks}
                    changeWeek={scheduleData.changeWeek}
                    onCreateTask={(day, hour) => openCreateModal(day, hour * 60)}
                    onActivityClick={(taskId) => {
                        const task = scheduleData.tasks.find((item) => item.id === taskId);

                        if (task) {
                            openEditModal(task);
                        }
                    }}
                />
            );
        }

        if (activeView === "activities") {
            return (
                <ActivitiesView
                    lang={lang}
                    weekId={scheduleData.weekId}
                    tasks={scheduleData.tasks}
                    onCreateTask={() => openCreateModal()}
                    onEditTask={openEditModal}
                    onDeleteTask={scheduleData.deleteTask}
                    onToggleComplete={scheduleData.toggleTaskComplete}
                />
            );
        }

        if (activeView === "tags") {
            return (
                <TagsView
                    lang={lang}
                    weekId={scheduleData.weekId}
                    tasks={scheduleData.tasks}
                />
            );
        }

        if (activeView === "import") {
            return <ImportView lang={lang} onImportJSON={handleImportJSON} />;
        }

        if (activeView === "export") {
            return (
                <ExportView
                    lang={lang}
                    onExportPDF={() => handleGraphicExport("pdf")}
                    onExportImage={handleGraphicExport}
                    onExportJSON={handleExportJSON}
                />
            );
        }

        if (activeView === "settings") {
            return (
                <SettingsView
                    lang={lang}
                    username={profile.username}
                    settings={scheduleData.settings}
                    updateSettings={scheduleData.updateSettings}
                    getDayName={getDayName}
                    onUpdateUsername={saveUsername}
                    onToggleLanguage={toggleLanguage}
                />
            );
        }

        return null;
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
            <div className="flex min-h-screen">
                <div
                    className={cn(
                        "fixed inset-0 z-30 bg-black/30 md:hidden",
                        sidebarOpen ? "block" : "hidden",
                    )}
                    onClick={() => setSidebarOpen(false)}
                />

                <AppSidebar
                    username={profile.username}
                    lang={lang}
                    activeView={activeView}
                    sidebarOpen={sidebarOpen}
                    onCloseSidebar={() => setSidebarOpen(false)}
                    onChangeView={setActiveView}
                    onOpenSettings={() => setActiveView("settings")}
                />

                <section className="flex min-w-0 flex-1 flex-col">
                    <AppTopbar
                        username={profile.username}
                        activeView={activeView}
                        lang={lang}
                        onToggleSidebar={() => setSidebarOpen((current) => !current)}
                        onToggleLanguage={toggleLanguage}
                        onEditProfile={() => setActiveView("settings")}
                        onCreateTask={() => openCreateModal()}
                        onExportPDF={() => handleGraphicExport("pdf")}
                        onExportImage={handleGraphicExport}
                        onExportJSON={handleExportJSON}
                        onImportJSON={handleImportJSON}
                    />

                    <div className="flex-1 overflow-y-auto">{renderActiveView()}</div>
                </section>
            </div>

            <ActivityModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                dayIdx={modalState.day}
                initialText={modalState.taskToEdit?.text || ""}
                initialColor={modalState.taskToEdit?.color || "indigo"}
                initialStartMinute={
                    modalState.taskToEdit?.startMinute ?? modalState.defaultStartMin
                }
                initialEndMinute={
                    modalState.taskToEdit?.endMinute ??
                    (modalState.defaultStartMin !== undefined
                        ? modalState.defaultStartMin + 60
                        : undefined)
                }
                getDayName={getDayName}
                lang={lang}
                onSave={(payload) => {
                    const previousTask = modalState.taskToEdit;

                    const task: ScheduleTask = {
                        id: previousTask?.id ?? createTaskId(),
                        day: payload.day,
                        startMinute: payload.startMinute,
                        endMinute: payload.endMinute,
                        text: payload.text,
                        color: payload.color,
                        completed: getCompletedState(payload.text, previousTask?.completed),
                    };

                    if (!payload.text.trim()) {
                        if (previousTask) {
                            scheduleData.deleteTask(previousTask.id);
                        }
                    } else {
                        scheduleData.saveTask(task);
                    }

                    closeModal();
                }}
            />

            <MobileNav
                lang={lang}
                activeView={activeView}
                onChangeView={setActiveView}
                onCreateTask={() => openCreateModal()}
            />
        </main>
    );
}
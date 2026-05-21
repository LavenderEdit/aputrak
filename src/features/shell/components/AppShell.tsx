"use client";

import { useMemo, useState } from "react";
import { ActivitiesView } from "@/features/activities/components/ActivitiesView";
import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { EditProfileModal } from "@/features/auth/components/EditProfileModal";
import { useOfflineAuth } from "@/features/auth/hooks/useOfflineAuth";
import { CalendarView } from "@/features/calendar/components/CalendarView";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { useScheduleExport } from "@/features/export/hooks/useScheduleExport";
import { useScheduleImport } from "@/features/import/hooks/useScheduleImport";
import { ActivityModal } from "@/features/schedule/components/ActivityModal";
import { useActivityModal } from "@/features/schedule/hooks/useActivityModal";
import { useOfflineSchedule } from "@/features/schedule/hooks/useOfflineSchedule";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { TagsView } from "@/features/tags/components/TagsView";
import { LoadingOverlay } from "@/shared/components/ui/LoadingOverlay";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { useToast } from "@/shared/hooks/useToast";
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
    const { showToast } = useToast();

    const [activeView, setActiveView] = useState<AppView>("dashboard");
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const firstActiveDay = useMemo(
        () => scheduleData.settings.activeDays[0] ?? 0,
        [scheduleData.settings.activeDays],
    );

    const { modalState, openCreateModal, openEditModal, closeModal } =
        useActivityModal(firstActiveDay, scheduleData.settings.startHour);

    const { exportLoading, handleGraphicExport, handleExportJSON } =
        useScheduleExport({
            profile,
            scheduleData,
            t,
            showToast,
        });

    const { importLoading, handleImportJSON } = useScheduleImport({
        scheduleData,
        t,
        showToast,
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
                    t={t}
                    tasks={scheduleData.tasks}
                    settings={scheduleData.settings}
                    loadingData={scheduleData.loadingData}
                    onCreateTask={() => openCreateModal()}
                    onOpenCalendar={() => setActiveView("calendar")}
                    onCopyPreviousWeek={async () => {
                        const success = await scheduleData.copyPreviousWeek();

                        showToast(
                            success ? t("cloneSuccess") : t("cloneError"),
                            success ? "success" : "error",
                        );
                    }}
                    onSmartReschedule={async () => {
                        const result = await scheduleData.smartReschedule();

                        if (result.success) {
                            showToast(t("smartTetrisSuccess"));
                            return;
                        }

                        if (result.reason === "no-space") {
                            showToast(t("smartTetrisNoSpace"), "error");
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
            return (
                <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                    <h2 className="font-display text-xl font-bold text-slate-950">
                        {lang === "es" ? "Importar Horario" : "Import Schedule"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {lang === "es"
                            ? "La vista de importación se conectará en la siguiente fase."
                            : "The import view will be connected in the next phase."}
                    </p>
                </div>
            );
        }

        if (activeView === "export") {
            return (
                <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                    <h2 className="font-display text-xl font-bold text-slate-950">
                        {lang === "es" ? "Exportar Horario" : "Export Schedule"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {lang === "es"
                            ? "La vista de exportación se conectará en la siguiente fase."
                            : "The export view will be connected in the next phase."}
                    </p>
                </div>
            );
        }

        if (activeView === "settings") {
            return (
                <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                    <h2 className="font-display text-xl font-bold text-slate-950">
                        {lang === "es" ? "Ajustes" : "Settings"}
                    </h2>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        {lang === "es" ? "Abrir ajustes" : "Open settings"}
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
            <div className="flex min-h-screen">
                <AppSidebar
                    username={profile.username}
                    lang={lang}
                    activeView={activeView}
                    onChangeView={setActiveView}
                    onCreateTask={() => openCreateModal()}
                    onOpenSettings={() => setActiveView("settings")}
                />

                <section className="flex min-w-0 flex-1 flex-col">
                    <AppTopbar
                        username={profile.username}
                        activeView={activeView}
                        lang={lang}
                        onToggleLanguage={toggleLanguage}
                        onEditProfile={() => setIsEditProfileOpen(true)}
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
                t={t}
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

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentName={profile.username}
                t={t}
                onSave={(newName) => {
                    saveUsername(newName);
                    setIsEditProfileOpen(false);
                }}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={scheduleData.settings}
                updateSettings={scheduleData.updateSettings}
                t={t}
                getDayName={getDayName}
            />

            <LoadingOverlay
                visible={exportLoading || importLoading}
                message={t("processing")}
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
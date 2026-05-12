"use client";
import React, { useState } from "react";
import { useOfflineAuth } from "../hooks/useOfflineAuth";
import { useOfflineSchedule, ScheduleTask } from "../hooks/useOfflineSchedule";
import { useAppManager } from "../hooks/useAppManager";
import { useLanguage } from "../hooks/useLanguage";
import { Utils } from "../lib/utils";

import { LoginScreen } from "../components/LoginScreen";
import { Header } from "../components/Header";
import { Controls } from "../components/Controls";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { ActivityModal } from "../components/ActivityModal";
import { Toast } from "../components/ui/Toast";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { EditProfileModal } from "../components/EditProfileModal";
import { SettingsModal } from "../components/SettingsModal";
import { CalendarPlus, Copy, Sparkles, X } from "lucide-react";

// TIPO PARA EL MODAL ACTUALIZADO
interface ModalStateV3 {
  isOpen: boolean;
  day: number;
  taskToEdit: ScheduleTask | null; // Si es null, es una tarea nueva
  defaultStartMin?: number; // Hora donde se hizo clic
}

export default function App() {
  const { profile, saveUsername, loadingAuth } = useOfflineAuth();
  const scheduleData = useOfflineSchedule();
  const { lang, toggleLanguage, t, getDayName } = useLanguage();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dismissedTetris, setDismissedTetris] = useState(false);

  // ESTADO DEL MODAL V3
  const [modalState, setModalState] = useState<ModalStateV3>({
    isOpen: false,
    day: 0,
    taskToEdit: null,
  });

  const {
    exportLoading,
    toast,
    showToast,
    handleGraphicExport,
    handleExportJSON,
    handleImportJSON,
  } = useAppManager(profile, scheduleData as any, t);

  const getOverdueTasksCount = () => {
    const isCurrentRealWeek =
      scheduleData.weekId === Utils.getWeekStartIdentifier(new Date());
    if (!isCurrentRealWeek || dismissedTetris) return 0;

    let count = 0;
    const now = new Date();
    const jsDay = now.getDay();
    const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const currentHour = now.getHours();

    scheduleData.tasks.forEach((task) => {
      if (!scheduleData.settings.activeDays.includes(task.day)) return;
      const taskHour = Math.floor(task.startMinute / 60);
      const isPast =
        task.day < currentDayIdx ||
        (task.day === currentDayIdx && taskHour < currentHour);

      if (isPast) {
        task.completed.forEach((isDone) => {
          if (!isDone) count++;
        });
      }
    });
    return count;
  };

  const overdueCount = getOverdueTasksCount();

  if (loadingAuth)
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  if (!profile?.username) return <LoginScreen onSave={saveUsername} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-2">
        <Header
          username={profile.username}
          lang={lang}
          toggleLanguage={toggleLanguage}
          t={t}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onExportPDF={() => handleGraphicExport("pdf")}
          onExportImage={handleGraphicExport}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
        />
        <Controls
          weekId={scheduleData.weekId}
          changeWeek={scheduleData.changeWeek}
          onOpenSettings={() => setIsSettingsOpen(true)}
          t={t}
          getDayName={getDayName}
        />

        {scheduleData.tasks.length === 0 && !scheduleData.loadingData && (
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 slide-in-from-top-4 shadow-sm">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <CalendarPlus className="text-indigo-500" size={32} />
            </div>
            <h3 className="text-indigo-900 font-bold text-xl mb-2">
              {t("emptyTitle")}
            </h3>
            <p className="text-indigo-700/80 text-sm max-w-md font-medium leading-relaxed mb-6">
              {t("emptyDesc")}
            </p>
            <button
              onClick={async () => {
                const success = await scheduleData.copyPreviousWeek();
                if (success) showToast(t("cloneSuccess"), "success");
                else showToast(t("cloneError"), "error");
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
            >
              <Copy size={18} />
              {t("cloneWeek")}
            </button>
          </div>
        )}

        {overdueCount > 0 && !scheduleData.loadingData && (
          <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm pr-10">
            <button
              onClick={() => setDismissedTetris(true)}
              className="absolute top-3 right-3 text-amber-400 hover:text-amber-700 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0 mx-auto sm:mx-0">
                <Sparkles className="text-amber-500" size={24} />
              </div>
              <div>
                <h3 className="text-amber-900 font-bold text-lg">
                  {t("smartTetrisTitle").replace(
                    "{count}",
                    overdueCount.toString(),
                  )}
                </h3>
                <p className="text-amber-700/80 text-sm font-medium">
                  {t("smartTetrisDesc")}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                const result = await scheduleData.smartReschedule();
                if (result.success)
                  showToast(t("smartTetrisSuccess"), "success");
                else if (result.reason === "no-space")
                  showToast(t("smartTetrisNoSpace"), "error");
              }}
              className="shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm w-full sm:w-auto justify-center"
            >
              <Sparkles size={18} />
              {t("smartTetrisBtn")}
            </button>
          </div>
        )}

        <div className="relative">
          <ScheduleGrid
            settings={scheduleData.settings}
            tasks={scheduleData.tasks}
            weekId={scheduleData.weekId}
            getDayName={getDayName}
            onCellClick={(day: number, hour: number) =>
              setModalState({
                isOpen: true,
                day,
                taskToEdit: null,
                defaultStartMin: hour * 60,
              })
            }
            onTaskClick={(task) =>
              setModalState({ isOpen: true, day: task.day, taskToEdit: task })
            }
            onDeleteTask={(taskId) => scheduleData.deleteTask(taskId)}
            onToggleComplete={(taskId, index) =>
              scheduleData.toggleTaskComplete(taskId, index)
            }
            onMoveTask={(taskId, newDay, newHour) =>
              scheduleData.moveTask(taskId, newDay, newHour)
            }
          />
        </div>
      </div>

      <ActivityModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
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
          const isNew = !modalState.taskToEdit;
          const taskObj: ScheduleTask = {
            id:
              modalState.taskToEdit?.id ||
              `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            day: payload.day,
            startMinute: payload.startMinute,
            endMinute: payload.endMinute,
            text: payload.text,
            color: payload.color,
            completed:
              modalState.taskToEdit?.completed ||
              Array(
                payload.text.split("\n").filter((t) => t.trim()).length,
              ).fill(false),
          };

          if (!payload.text.trim()) {
            if (!isNew) scheduleData.deleteTask(taskObj.id);
          } else {
            scheduleData.saveTask(taskObj);
          }
          setModalState({ ...modalState, isOpen: false });
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
      <LoadingOverlay visible={exportLoading} message={t("processing")} />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}

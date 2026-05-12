"use client";
import React, { useState } from "react";
import { useOfflineAuth } from "../hooks/useOfflineAuth";
import { useOfflineSchedule } from "../hooks/useOfflineSchedule";
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
import { CalendarPlus, Copy, Sparkles } from "lucide-react";

export default function App() {
  const { profile, saveUsername, loadingAuth } = useOfflineAuth();
  const scheduleData = useOfflineSchedule();

  const { lang, toggleLanguage, t, getDayName } = useLanguage();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const {
    modalState,
    setModalState,
    exportLoading,
    toast,
    handleGraphicExport,
    handleExportJSON,
    handleImportJSON,
  } = useAppManager(profile, scheduleData, t);

  const isCurrentRealWeek =
    scheduleData.weekId === Utils.getWeekStartIdentifier(new Date());

  const hasOverdueTasks = () => {
    if (!isCurrentRealWeek) return false;
    const now = new Date();
    const currentDayIdx = now.getDay();
    const currentHour = now.getHours();

    return Object.entries(scheduleData.activities).some(([key, value]) => {
      const [dayStr, hourStr] = key.split("-");
      const day = parseInt(dayStr);
      const hour = parseInt(hourStr);
      const isPast =
        day < currentDayIdx || (day === currentDayIdx && hour < currentHour);

      if (isPast && value && value.startsWith("{")) {
        try {
          const parsed = JSON.parse(value);
          const taskLines = parsed.text
            .split("\n")
            .filter((t: string) => t.trim() !== "");
          const completed = parsed.completed || [];
          return taskLines.some((_: any, idx: number) => !completed[idx]);
        } catch (e) {
          return false;
        }
      }
      return false;
    });
  };

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
          settings={scheduleData.settings}
          updateSettings={scheduleData.updateSettings}
          weekId={scheduleData.weekId}
          changeWeek={scheduleData.changeWeek}
          t={
            t
          }
          getDayName={getDayName}
        />

        {Object.keys(scheduleData.activities).length === 0 &&
          !scheduleData.loadingData && (
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
                  if (success) {
                    showToast(t("cloneSuccess"), "success");
                  } else {
                    showToast(t("cloneError"), "error");
                  }
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
              >
                <Copy size={18} />
                {t("cloneWeek")}
              </button>
            </div>
          )}

        {hasOverdueTasks() && !scheduleData.loadingData && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0 mx-auto sm:mx-0">
                <Sparkles className="text-amber-500" size={24} />
              </div>
              <div>
                <h3 className="text-amber-900 font-bold text-lg">
                  {t("smartTetrisTitle")}
                </h3>
                <p className="text-amber-700/80 text-sm font-medium">
                  {t("smartTetrisDesc")}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                const result = await scheduleData.smartReschedule();
                if (result.success) {
                  showToast(t("smartTetrisSuccess"), "success");
                } else if (result.reason === "no-space") {
                  showToast(t("smartTetrisNoSpace"), "error");
                }
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
            activities={scheduleData.activities}
            weekId={scheduleData.weekId}
            getDayName={
              getDayName
            }
            onCellClick={(day: number, hour: number, text?: string) =>
              setModalState({ isOpen: true, day, hour, text: text || "" })
            }
            onDeleteActivity={(day: number, hour: number) =>
              scheduleData.saveActivity(day, hour, "")
            }
          />
        </div>
      </div>

      <ActivityModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        dayName={getDayName(modalState.day)}
        hourStr={Utils.formatTime(modalState.hour)}
        initialText={modalState.text}
        t={t}
        onSave={(newText: string) => {
          scheduleData.saveActivity(modalState.day, modalState.hour, newText);
          setModalState({ ...modalState, isOpen: false });
        }}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentName={profile.username}
        t={t}
        onSave={(newName: string) => {
          saveUsername(newName);
          setIsEditProfileOpen(false);
        }}
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

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
import { CalendarPlus, Copy } from "lucide-react";

export default function App() {
  const { profile, saveUsername, loadingAuth } = useOfflineAuth();
  const scheduleData = useOfflineSchedule();

  const { lang, toggleLanguage, t, getDayName } = useLanguage();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    modalState,
    setModalState,
    exportLoading,
    toast,
    showToast,
    handleGraphicExport,
    handleExportJSON,
    handleImportJSON,
  } = useAppManager(profile, scheduleData, t);

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

        <div className="relative">
          <ScheduleGrid
            settings={scheduleData.settings}
            activities={scheduleData.activities}
            weekId={scheduleData.weekId}
            getDayName={getDayName}
            onCellClick={(day: number, hour: number, text?: string) =>
              setModalState({ isOpen: true, day, hour, text: text || "" })
            }
            onDeleteActivity={(day: number, hour: number) =>
              scheduleData.saveActivity(day, hour, "")
            }
            onToggleComplete={(
              day: number,
              hour: number,
              taskIndex: number,
            ) => {
              const currentActivity = scheduleData.activities[`${day}-${hour}`];
              if (!currentActivity) return;

              let parsed = {
                text: currentActivity,
                color: "indigo",
                completed: [] as boolean[],
              };
              if (currentActivity.startsWith("{")) {
                try {
                  parsed = JSON.parse(currentActivity);
                  parsed.completed = parsed.completed || [];
                } catch (e) {}
              }

              parsed.completed[taskIndex] = !parsed.completed[taskIndex];
              scheduleData.saveActivity(day, hour, JSON.stringify(parsed));
            }}
            onMoveActivity={(
              fromDay: number,
              fromHour: number,
              toDay: number,
              toHour: number,
            ) => {
              scheduleData.moveActivity(fromDay, fromHour, toDay, toHour);
            }}
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
        onSave={(newText: string, color: string) => {
          const payload = newText.trim()
            ? JSON.stringify({ text: newText, color })
            : "";
          scheduleData.saveActivity(modalState.day, modalState.hour, payload);
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

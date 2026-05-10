"use client";
import React, { useState } from "react";
import { useOfflineAuth } from "../hooks/useOfflineAuth";
import { useOfflineSchedule } from "../hooks/useOfflineSchedule";
import { Utils } from "../lib/utils";
import { DAYS_OF_WEEK } from "../lib/constants";

import { LoginScreen } from "../components/LoginScreen";
import { Header } from "../components/Header";
import { Controls } from "../components/Controls";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { ActivityModal } from "../components/ActivityModal";
import { Toast } from "../components/ui/Toast";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";

export default function App() {
  const { profile, saveUsername, loadingAuth } = useOfflineAuth();
  const scheduleData = useOfflineSchedule();

  const [modalState, setModalState] = useState({
    isOpen: false,
    day: 0,
    hour: 0,
    text: "",
  });

  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleGraphicExport = async (type: "pdf" | "desktop" | "mobile") => {
    try {
      setExportLoading(true);

      if (type === "pdf") {
        await Utils.loadExportScripts();
      }

      // @ts-ignore
      if (!window.htmlToImage) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      document.body.classList.add("pdf-export-mode");
      const containerWrapper = document.getElementById(
        "schedule-container-wrapper",
      )!;
      const element = document.getElementById("schedule-container")!;

      const originalOverflow = containerWrapper.style.overflow;
      containerWrapper.style.overflow = "visible";
      element.style.width = "max-content";
      element.style.padding = "32px";

      await new Promise((r) => setTimeout(r, 200));

      // @ts-ignore
      const canvas = await window.htmlToImage.toCanvas(element, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      containerWrapper.style.overflow = originalOverflow;
      element.style.width = "";
      element.style.padding = "";
      document.body.classList.remove("pdf-export-mode");

      const filename = `QuipuPlan_${profile?.username}_${scheduleData.weekId}`;

      if (type === "pdf") {
        const orientation =
          canvas.width > canvas.height ? "landscape" : "portrait";
        // @ts-ignore
        const pdf = new window.jspdf.jsPDF({
          orientation,
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.98),
          "JPEG",
          0,
          0,
          canvas.width,
          canvas.height,
        );
        pdf.save(`${filename}.pdf`);
      } else {
        const targetWidth = type === "desktop" ? 1920 : 1080;
        const targetHeight = type === "desktop" ? 1080 : 1920;
        const bgColor = "#1e293b"; // Color Slate-800 de fondo

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;
        const ctx = finalCanvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          const padding = 80;
          const availableWidth = targetWidth - padding * 2;
          const availableHeight = targetHeight - padding * 2;

          const scaleX = availableWidth / canvas.width;
          const scaleY = availableHeight / canvas.height;
          const scale = Math.min(scaleX, scaleY, 1);

          const drawWidth = canvas.width * scale;
          const drawHeight = canvas.height * scale;

          const x = (targetWidth - drawWidth) / 2;
          const y = (targetHeight - drawHeight) / 2;

          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 15;

          ctx.drawImage(canvas, x, y, drawWidth, drawHeight);

          const link = document.createElement("a");
          link.download = `${filename}_${type}.png`;
          link.href = finalCanvas.toDataURL("image/png", 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      showToast("Exportación exitosa");
    } catch (error) {
      console.error(error);
      showToast("Error al exportar gráfico", "error");

      document.body.classList.remove("pdf-export-mode");
      const containerWrapper = document.getElementById(
        "schedule-container-wrapper",
      );
      const element = document.getElementById("schedule-container");
      if (containerWrapper) containerWrapper.style.overflow = "auto";
      if (element) {
        element.style.width = "";
        element.style.padding = "";
      }
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExportLoading(true);
      const backupData = {
        username: profile?.username,
        exportDate: new Date().toISOString(),
        weekId: scheduleData.weekId,
        settings: scheduleData.settings,
        activities: scheduleData.activities,
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `QuipuPlan_Respaldo_${profile?.username}_${scheduleData.weekId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("Respaldo exportado con éxito");
    } catch (error) {
      console.error(error);
      showToast("Error al exportar respaldo", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportJSON = async (file: File) => {
    try {
      setExportLoading(true);
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.settings || !data.activities) {
        throw new Error("Formato de archivo inválido");
      }

      scheduleData.updateSettings(data.settings);

      for (const [key, value] of Object.entries(data.activities)) {
        const [day, hour] = key.split("-");
        scheduleData.saveActivity(Number(day), Number(hour), value as string);
      }

      showToast("Respaldo restaurado con éxito");
    } catch (error) {
      console.error(error);
      showToast("El archivo no es un respaldo válido", "error");
    } finally {
      setExportLoading(false);
    }
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
        />

        <div className="relative">
          <ScheduleGrid
            settings={scheduleData.settings}
            activities={scheduleData.activities}
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
        dayName={DAYS_OF_WEEK[modalState.day]}
        hourStr={Utils.formatTime(modalState.hour)}
        initialText={modalState.text}
        onSave={(newText: string) => {
          scheduleData.saveActivity(modalState.day, modalState.hour, newText);
          setModalState({ ...modalState, isOpen: false });
        }}
      />
      <LoadingOverlay visible={exportLoading} message="Procesando..." />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}

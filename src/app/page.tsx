"use client";
import { useState, useRef } from "react";
import { useOfflineAuth } from "../hooks/useOfflineAuth";
import { useOfflineSchedule } from "../hooks/useOfflineSchedule";
import { DB } from "../lib/db";
import { Utils } from "../lib/utils";
import { DAYS_OF_WEEK } from "../lib/constants";

// Componentes UI
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
    type: "success",
  });

  const showToast = (message: string, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleGraphicExport = async (type: "pdf" | "desktop" | "mobile") => {
    try {
      setExportLoading(true);
      await Utils.loadExportScripts();

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
      // @ts-ignore (evitamos error de tipado con html2canvas cargado por CDN)
      const canvas = await window.html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
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
        // Lógica de exportación de imagen aquí (similar a la original)
      }
      showToast("Exportación exitosa");
    } catch (error) {
      showToast("Error al exportar gráfico", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportJSON = async () => {
    // Lógica de respaldo...
  };

  const handleImportJSON = (file: File) => {
    // Lógica de restauración...
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

"use client";
import React, { useRef } from "react";
import {
  CheckCircle,
  Download,
  ImageIcon,
  MonitorSmartphone,
  Upload,
  Edit2,
  Globe,
} from "lucide-react";

interface HeaderProps {
  username: string;
  lang: string;
  toggleLanguage: () => void;
  t: (key: any) => string;
  onEditProfile: () => void;
  onExportPDF: () => void;
  onExportImage: (type: "desktop" | "mobile") => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  username,
  lang,
  toggleLanguage,
  t,
  onEditProfile,
  onExportPDF,
  onExportImage,
  onExportJSON,
  onImportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-xl shadow-sm mb-6 no-print border border-slate-100">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          {t("scheduleOf")} {username}
          <button
            onClick={onEditProfile}
            className="text-slate-400 hover:text-indigo-600 transition-colors"
            title={t("editProfile")}
          >
            <Edit2 size={20} />
          </button>
        </h1>
        <p className="text-emerald-600 font-medium text-sm mt-1 flex items-center gap-1">
          <CheckCircle size={14} /> {t("savedOffline")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm mr-2"
          title="Cambiar idioma / Change language"
        >
          <Globe size={16} />
          {lang.toUpperCase()}
        </button>

        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          <Download size={16} /> PDF
        </button>
        <button
          onClick={() => onExportImage("desktop")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          <MonitorSmartphone size={16} /> PC
        </button>
        <button
          onClick={() => onExportImage("mobile")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          <ImageIcon size={16} /> Móvil
        </button>

        <div className="h-full w-px bg-slate-200 mx-1"></div>

        <button
          onClick={onExportJSON}
          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm border border-indigo-100"
        >
          <Download size={16} /> {t("backup")}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm border border-indigo-100"
        >
          <Upload size={16} /> {t("restore")}
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onImportJSON(e.target.files[0]);
              }
              e.target.value = "";
            }}
          />
        </button>
      </div>
    </div>
  );
};

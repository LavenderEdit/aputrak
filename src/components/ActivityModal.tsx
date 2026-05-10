"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  dayName: string;
  hourStr: string;
  initialText?: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayName,
  hourStr,
  initialText,
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialText || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Actividad</h3>
          <button
            onClick={onClose}
            className="text-indigo-100 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(text);
          }}
          className="p-6"
        >
          <p className="text-sm text-slate-500 mb-4 font-medium">
            Asignando a{" "}
            <span className="text-indigo-600 font-bold">{dayName}</span> a las{" "}
            <span className="text-indigo-600 font-bold">{hourStr}</span>
          </p>

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 mb-6 font-medium text-slate-800"
            placeholder="Ej: Clase, Gimnasio..."
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ACTIVITY_COLORS } from "@/lib/constants";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, color: string) => void;
  dayName: string;
  hourStr: string;
  initialText?: string;
  t: (key: any) => string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayName,
  hourStr,
  initialText,
  t,
}) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("indigo");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      let textVal = initialText || "";
      let colorVal = "indigo";

      if (textVal.startsWith("{")) {
        try {
          const parsed = JSON.parse(textVal);
          textVal = parsed.text;
          colorVal = parsed.color || "indigo";
        } catch (e) {
          // Si falla el parseo, lo tratamos como texto normal antiguo
        }
      }

      setText(textVal);
      setColor(colorVal);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{t("activity")}</h3>
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
            onSave(text, color);
          }}
          className="p-6"
        >
          <p className="text-sm text-slate-500 mb-4 font-medium">
            {t("assigningTo")}{" "}
            <span className="text-indigo-600 font-bold">{dayName}</span>{" "}
            {t("at")}{" "}
            <span className="text-indigo-600 font-bold">{hourStr}</span>
          </p>

          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 mb-4 font-medium text-slate-800 resize-none h-28"
            placeholder={t("taskPlaceholder")}
          />

          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-3 font-medium">
              {t("colorCategory")}
            </p>
            <div className="flex gap-3">
              {ACTIVITY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.picker} transition-all ${
                    color === c.id
                      ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {t("saveTask")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

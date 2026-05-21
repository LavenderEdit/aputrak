"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TranslateFn } from "@/shared/types/i18n.types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
  t: TranslateFn;
}

interface EditProfileFormProps {
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
  t: TranslateFn;
}

function EditProfileForm({
  currentName,
  onClose,
  onSave,
  t,
}: EditProfileFormProps) {
  const [name, setName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between bg-indigo-600 px-6 py-4">
        <h3 className="text-lg font-bold text-white">{t("editProfile")}</h3>

        <button
          onClick={onClose}
          className="text-indigo-100 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (name.trim()) {
            onSave(name.trim());
          }
        }}
        className="p-6"
      >
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mb-6 w-full rounded-xl border-2 border-slate-200 p-3 font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
          placeholder={t("yourName")}
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100"
          >
            {t("cancel")}
          </button>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onSave,
  t,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <EditProfileForm
        key={currentName}
        currentName={currentName}
        onClose={onClose}
        onSave={onSave}
        t={t}
      />
    </div>
  );
}
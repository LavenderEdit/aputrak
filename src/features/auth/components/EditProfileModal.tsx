"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
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
        <Button variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Button>

        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onSave,
  t,
}: EditProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("editProfile")}>
      <EditProfileForm
        key={currentName}
        currentName={currentName}
        onClose={onClose}
        onSave={onSave}
        t={t}
      />
    </Modal>
  );
}
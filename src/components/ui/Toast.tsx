"use client";
import { CheckCircle, AlertCircle } from "lucide-react";

export const Toast = ({
  message,
  type,
  visible,
}: {
  message: string;
  type: string;
  visible: boolean;
}) => {
  if (!visible) return null;
  const isError = type === "error";
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-white transition-all ${isError ? "bg-red-600" : "bg-emerald-600"}`}
    >
      {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

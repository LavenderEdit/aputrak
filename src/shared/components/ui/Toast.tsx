"use client";

import { useCallback, useState } from "react";

export type ToastType = "success" | "error";

export function useToast() {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as ToastType,
  });

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });

    window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3000);
  }, []);

  return {
    toast,
    showToast,
  };
}
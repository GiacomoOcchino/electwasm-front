// app/context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Toast, ToastProvider, ToastViewport } from "../ui/toast";
// import { Progress } from "../ui/progress";
import {
  NotificationContextType,
  ToastContextType,
} from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<ToastContextType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const showNotification = (
    type: "default" | "destructive" | "running" | null | undefined,
    message: string
  ) => {
    const id = Date.now();
    if (type === "running") {
      setLoading(true);
    } else {
      setLoading(false);
    }
    setToasts((prev) => [...prev, { type, message, id }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <ToastProvider>
        {children}
        <ToastViewport />
        {loading && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 p-3 bg-blue-100 border border-blue-500 rounded shadow">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Transazione in corso...</span>
            </div>
          </div>
        )}
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.type}>
            {toast.message}
          </Toast>
        ))}
      </ToastProvider>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve essere utilizzato all'interno di un NotificationProvider"
    );
  }
  return context;
};

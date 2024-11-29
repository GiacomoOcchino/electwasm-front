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
  const showNotification = (
    type: "default" | "destructive" | null | undefined,
    message: string
  ) => {
    const id = Date.now();

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

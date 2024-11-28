export interface NotificationContextType {
  showNotification: (
    type: "default" | "destructive" | "running",
    message: string
  ) => void;
}
export interface ToastContextType {
  type: "default" | "destructive" | "running" | null | undefined;
  message: string;
  id: number;
}
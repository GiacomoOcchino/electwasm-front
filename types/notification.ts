export interface NotificationContextType {
  showNotification: (
    type: "default" | "destructive",
    message: string
  ) => void;
}
export interface ToastContextType {
  type: "default" | "destructive" | null | undefined;
  message: string;
  id: number;
}
export type Goal = {
  id: string;
  description: string;
  completed: boolean;
  time?: Date;
  notificationIdentifier?: {
    reminderNotification: string;
    notification: string;
  };
};

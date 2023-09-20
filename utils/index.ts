import notifee, {TriggerType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import dayjs from 'dayjs';
import {PermissionsAndroid} from 'react-native';
import {REMINDER_TIME} from '../constants';
import {Goal} from '../types';

export const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();

  return token;
};

export const requestNotificationPermission = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
};

export const scheduleNotification = async (goal: Goal) => {
  const notificationIdentifier = {
    reminderNotification: '',
    notification: '',
  };

  if (!goal.time) {
    return notificationIdentifier;
  }

  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  const reminderTimestampMilliSeconds =
    goal.time?.getTime() - REMINDER_TIME * 60 * 1000;

  if (reminderTimestampMilliSeconds - Date.now() > 0) {
    try {
      const reminderNotification = await notifee.createTriggerNotification(
        {
          title: "You've a goal to accomplish! 🎯",
          body: `${goal.description} ${
            goal.time && `Due by ${dayjs(goal.time).format('hh:mm A')}`
          }`,
          android: {
            channelId,
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: reminderTimestampMilliSeconds,
        },
      );

      notificationIdentifier.reminderNotification = reminderNotification;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const notification = await notifee.createTriggerNotification(
      {
        title: "You've a goal to accomplish! 🎯",
        body: goal.description,
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: goal.time?.getTime(),
      },
    );

    notificationIdentifier.notification = notification;
  } catch (error) {
    console.error(error);
  }

  return notificationIdentifier;
};

export const cancelNotification = async ({notificationIdentifier}: Goal) => {
  if (notificationIdentifier?.notification) {
    await notifee.cancelNotification(notificationIdentifier?.notification);
  }

  if (notificationIdentifier?.reminderNotification) {
    await notifee.cancelNotification(
      notificationIdentifier?.reminderNotification,
    );
  }
};

import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {Feather} from 'react-native-feather';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import uuid from 'react-uuid';

import Goal from './components/Goal';
import DateTimePicker from './components/DateTimePicker';
import {colors} from './constants';
import useGoals from './hooks/useGoals';
import SplashScreenProvider from './providers/SplashScreenProvider';
import {ColorScheme, Goal as GoalType} from './types';
import {cancelNotification, scheduleNotification} from './utils';

function App(): JSX.Element {
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const styles = styling(colorScheme);

  const [isAppReady, setIsAppReady] = useState(false);

  const [goal, setGoal] = useState('');
  const [time, setTime] = useState<Date>();

  const {goals, setGoals} = useGoals('@goals', [
    {
      id: uuid(),
      description: 'Set goals for today',
      completed: false,
    },
  ]);

  const [localGoals, setLocalGoals] = useState<GoalType[]>(goals); // to avoid flickering issues while reordering goals

  const {goals: completedGoals, setGoals: setCompletedGoals} = useGoals(
    '@completed_goals',
    [
      {
        id: uuid(),
        description: 'Install app to track goals',
        completed: false,
      },
    ],
  );

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  }, []);

  const markAsCompleted = async (completedGoal: GoalType) => {
    cancelNotification(completedGoal);
    setCompletedGoals([completedGoal, ...completedGoals]);
    const updatedGoals = goals.filter(g => g.id !== completedGoal.id);
    setGoals(updatedGoals);
  };

  const deleteGoal = (deletedGoal: GoalType) => {
    const updatedGoals = completedGoals.filter(g => g.id !== deletedGoal.id);
    setCompletedGoals(updatedGoals);
  };

  const addGoal = async () => {
    if (!goal) {
      return;
    }

    const newGoal: GoalType = {
      description: goal,
      id: uuid(),
      completed: false,
      time,
    };

    newGoal.notificationIdentifier = await scheduleNotification(newGoal);

    setGoals([newGoal, ...goals]);
    setGoal('');
    setTime(undefined);
  };

  return (
    <SplashScreenProvider isAppReady={isAppReady}>
      <GestureHandlerRootView style={styles.flexGrow}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={styles.listContainer}>
            <View style={styles.list}>
              <Text style={styles.header}>Goals To Accomplish 🎯</Text>
              <Text style={styles.subHeader}>Check to mark as completed</Text>

              <DraggableFlatList
                data={localGoals}
                onDragEnd={({data}) => {
                  setLocalGoals(data);
                  setGoals(data);
                }}
                keyExtractor={item => item.id}
                renderItem={({item, drag, isActive}) => (
                  <TouchableOpacity onLongPress={drag} disabled={isActive}>
                    <Goal data={item} action={markAsCompleted} type="todo" />
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.list}>
              <Text style={styles.header}>Completed Goals 🚀</Text>

              <FlatList
                style={styles.flexGrow}
                data={completedGoals}
                renderItem={({item}) => (
                  <Goal data={item} action={deleteGoal} type="completed" />
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={goal}
              onChangeText={e => setGoal(e)}
              placeholder="Type your goal here..."
              multiline
            />

            <View style={styles.actionButtons}>
              <DateTimePicker time={time} setTime={setTime} />
              <Feather
                stroke={colors[colorScheme].primary}
                width={25}
                height={50}
                onPress={addGoal}
              />
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SplashScreenProvider>
  );
}

const styling = (colorScheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[colorScheme].secondary,
      padding: 10,
    },
    flexGrow: {
      flex: 1,
    },
    header: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: '500',
      color: colors[colorScheme].header,
    },
    subHeader: {
      fontSize: 10,
      textAlign: 'center',
    },
    inputContainer: {
      gap: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
    },
    input: {
      flex: 1,
      borderWidth: 2,
      borderColor: colors[colorScheme].header,
      borderRadius: 10,
      height: 50,
      padding: 10,
      paddingRight: 80,
    },
    addIcon: {position: 'absolute', right: 10},
    listContainer: {
      flex: 1,
      gap: 5,
    },
    list: {
      flex: 1,
      borderColor: colors[colorScheme].header,
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      overflow: 'hidden',
    },
    actionButtons: {
      flexDirection: 'row',
      position: 'absolute',
      right: 10,
      gap: 15,
    },
  });

export default App;

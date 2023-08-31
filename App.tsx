import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Feather} from 'react-native-feather';
import uuid from 'react-uuid';

import Goal from './components/Goal';
import DateTimePicker from './components/DateTimePicker';
import {colors} from './constants';
import useGoals from './hooks/useGoals';
import {ColorScheme, Goal as GoalType} from './types';

function App(): JSX.Element {
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const styles = styling(colorScheme);

  const [goal, setGoal] = useState('');
  const [time, setTime] = useState<Date>();

  const {goals, setGoals} = useGoals('@goals', [
    {
      id: uuid(),
      description: 'Set goals for today',
      completed: false,
    },
  ]);

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

  const markAsCompleted = async (completedGoal: GoalType) => {
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

    setGoals([newGoal, ...goals]);
    setGoal('');
    setTime(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.listContainer}>
        <View style={styles.list}>
          <Text style={styles.header}>Goals To Accomplish 🎯</Text>
          <Text style={styles.subHeader}>Check to mark as completed</Text>

          <FlatList
            style={styles.flexGrow}
            data={goals}
            renderItem={({item}) => (
              <Goal data={item} action={markAsCompleted} type="todo" />
            )}
            keyExtractor={item => item.id}
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

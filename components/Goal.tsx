import React, {useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Easing,
  useColorScheme,
} from 'react-native';
import {CheckCircle, Circle, X} from 'react-native-feather';

import DueTime from './DueTime';
import {colors} from '../constants';
import {ColorScheme, Goal as GoalType} from '../types';

interface GoalProps {
  data: GoalType;
  action: (data: GoalType) => void;
  type: 'todo' | 'completed';
}

const Goal: React.FC<GoalProps> = ({data, action, type}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = styling(colorScheme);

  const [disabled, setDisabled] = useState(false);

  const completed = type === 'completed';
  const todo = type === 'todo';

  const completeAnimatedValue = useRef(new Animated.Value(0)).current;
  const fadeAnimatedValue = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    setDisabled(true);
    Animated.timing(todo ? fadeAnimatedValue : completeAnimatedValue, {
      toValue: todo ? 0 : 1000,
      easing: Easing.ease,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      action(data);
      setDisabled(false);
    });
  };

  const completedGoalAnimatedStyles = {
    opacity: fadeAnimatedValue,
  };

  const removedGoalAnimatedStyles = {
    transform: [{translateX: completeAnimatedValue}],
  };

  return (
    <Animated.View
      style={[
        styles.goalContainer,
        completed && removedGoalAnimatedStyles,
        todo && completedGoalAnimatedStyles,
      ]}>
      {todo && (
        <Circle
          disabled={disabled}
          style={styles.actionButton}
          stroke="#0c6274"
          onPress={onPress}
        />
      )}

      {completed && (
        <CheckCircle style={styles.actionButton} stroke="#0c6274" />
      )}

      <View style={styles.goal}>
        <Text style={styles.description}>{data.description}</Text>
        {!!data.time && !completed && <DueTime time={data.time} />}
      </View>

      {completed && (
        <X
          disabled={disabled}
          style={styles.actionButton}
          stroke="#B22222"
          onPress={onPress}
        />
      )}
    </Animated.View>
  );
};

const styling = (colorScheme: ColorScheme) =>
  StyleSheet.create({
    goalContainer: {
      gap: 5,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    goal: {
      gap: 5,
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      alignSelf: 'flex-start',
      marginTop: 5,
    },
    description: {
      fontSize: 18,
      color: colors[colorScheme].primary,
    },
  });

export default Goal;

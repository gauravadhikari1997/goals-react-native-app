import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {Goal} from '../types';

const useGoals = (storageKey: string, initialData: Goal[]) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const {getItem: getGoalsFromStorage, setItem: setGoalsToStorage} =
    useAsyncStorage(storageKey);

  const readGoalsFromStorage = async () => {
    try {
      const allGoals = JSON.parse(
        (await getGoalsFromStorage()) || JSON.stringify(initialData),
      );
      setGoals(allGoals);
    } catch (error) {
      Alert.alert('Error Reading Goals', JSON.stringify(error));
    }
  };

  const writeGoalsToStorage = async (updatedGoals: Goal[]) => {
    try {
      await setGoalsToStorage(JSON.stringify(updatedGoals));
      // refetch the goals
      readGoalsFromStorage();
    } catch (error) {
      Alert.alert(`Unable to write goal to storage for ${storageKey}`);
    }
  };

  useEffect(() => {
    try {
      readGoalsFromStorage();
    } catch (error) {
      Alert.alert(`Unable read goals from storage for ${storageKey}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    goals,
    setGoals: writeGoalsToStorage,
  };
};

export default useGoals;

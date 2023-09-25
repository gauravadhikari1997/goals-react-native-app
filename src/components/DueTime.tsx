import React from 'react';
import dayjs from 'dayjs';
import {StyleSheet, Text, View} from 'react-native';

import {Goal} from '../types';

interface DueTimeProps extends Pick<Goal, 'time'> {}

const DueTime: React.FC<DueTimeProps> = ({time}) => {
  const isOverdue = dayjs(time) < dayjs();
  const formattedTime = dayjs(time).format('D MMM YY hh:mm A');

  return (
    <View>
      {isOverdue && (
        <Text style={[styles.time, styles.overdueTime]}>
          Overdue {formattedTime}
        </Text>
      )}
      {!isOverdue && (
        <Text style={[styles.time, styles.dueTime]}>Due {formattedTime}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  time: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  dueTime: {
    color: '#FFFFFF',
    borderColor: '#008080',
    backgroundColor: '#008080',
  },
  overdueTime: {
    color: '#FFFFFF',
    borderColor: '#B22222',
    backgroundColor: '#B22222',
  },
});

export default DueTime;

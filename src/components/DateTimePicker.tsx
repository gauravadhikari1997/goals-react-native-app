import React, {useState} from 'react';
import {View, useColorScheme} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Clock} from 'react-native-feather';

import {colors} from '../constants';

interface DateTimePickerProps {
  time?: Date;
  setTime: (date?: Date) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  time = new Date(),
  setTime,
}) => {
  const colorScheme = useColorScheme() ?? 'light';

  const [open, setOpen] = useState(false);

  return (
    <View>
      <Clock
        stroke={colors[colorScheme].primary}
        width={25}
        height={50}
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={time}
        onConfirm={date => {
          setOpen(false);
          setTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateTimePicker;

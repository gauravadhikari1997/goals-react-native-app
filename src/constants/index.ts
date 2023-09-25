const commonColor = {
  commonWhite: '#FFFFFF',
  commonBlack: '#000000',
  activeColor: '#DE5E69',
  inactiveColor: '#DE5E6950',
  boxActiveColor: '#DE5E6940',
};

const colors = {
  light: {
    secondary: '#FFFFFF',
    primary: 'gray',
    header: '#0c6274',
    ...commonColor,
  },
  dark: {
    secondary: 'black',
    primary: '#FFFFFF',
    header: '#FFFFFF',
    ...commonColor,
  },
};

const REMINDER_TIME = 15;

export {colors, REMINDER_TIME};

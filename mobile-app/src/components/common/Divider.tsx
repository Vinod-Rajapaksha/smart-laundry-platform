import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  marginVertical?: number;
}

const Divider: React.FC<DividerProps> = ({ 
  style, 
  color = COLORS.BORDER_LIGHT, 
  marginVertical = 16 
}) => {
  return (
    <View style={[
      styles.divider, 
      { backgroundColor: color, marginVertical }, 
      style
    ]} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});

export default Divider;

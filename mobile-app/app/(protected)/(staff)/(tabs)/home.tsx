import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../../src/theme/colors';

export default function StaffHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Staff Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  text: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
});
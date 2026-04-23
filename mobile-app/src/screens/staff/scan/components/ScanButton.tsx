import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';

interface ScanButtonProps {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

/**
 * Reusable action button for the Scanning workflow.
 * Features a high-visibility design with support for icons and variants.
 */
export const ScanButton = ({ label, icon: Icon, onPress, variant = 'primary', style }: ScanButtonProps) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary': return 'rgba(255, 255, 255, 0.2)';
      case 'danger': return COLORS.ERROR;
      default: return COLORS.PRIMARY;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        btnStyles.container,
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      {Icon && <Icon size={20} color={COLORS.WHITE} style={{ marginRight: 8 }} />}
      <Text style={btnStyles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const btnStyles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});

export default ScanButton;

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style, textStyle }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: COLORS.SUCCESS_BACKGROUND, borderColor: COLORS.SUCCESS_BORDER };
      case 'warning':
        return { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' };
      case 'error':
        return { backgroundColor: COLORS.ERROR_BACKGROUND, borderColor: COLORS.ERROR_BORDER };
      case 'info':
        return { backgroundColor: COLORS.INFO_BACKGROUND, borderColor: COLORS.BORDER_LIGHT };
      case 'primary':
      default:
        return { backgroundColor: COLORS.PRIMARY_SOFT, borderColor: COLORS.PRIMARY_SOFT_BORDER };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return COLORS.SUCCESS_TEXT;
      case 'warning':
        return '#B45309';
      case 'error':
        return COLORS.ERROR_TEXT;
      case 'info':
        return COLORS.TEXT_SECONDARY;
      case 'primary':
      default:
        return COLORS.PRIMARY;
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    textTransform: 'uppercase',
  },
});

export default Badge;

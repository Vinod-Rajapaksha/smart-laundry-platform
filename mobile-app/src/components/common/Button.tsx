import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
  View
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY };
      case 'secondary':
        return { backgroundColor: COLORS.SECONDARY, borderColor: COLORS.SECONDARY };
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: COLORS.PRIMARY, borderWidth: 1.5 };
      case 'ghost':
        return { backgroundColor: 'transparent', borderColor: 'transparent' };
      case 'danger':
        return { backgroundColor: COLORS.ERROR, borderColor: COLORS.ERROR };
      case 'success':
        return { backgroundColor: COLORS.SUCCESS, borderColor: COLORS.SUCCESS };
      default:
        return { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY };
    }
  };

  const getTextColor = () => {
    if (isDisabled && !loading) return COLORS.TEXT_MUTED;

    if (isOutline || isGhost) {
      return COLORS.PRIMARY;
    }

    if (variant === 'danger') return COLORS.WHITE;
    if (variant === 'success') return COLORS.WHITE;

    return COLORS.WHITE;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, height: 40 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 20, height: 48 };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 24, height: 56 };
      case 'xl':
        return { paddingVertical: 16, paddingHorizontal: 28, height: 64 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20, height: 48 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variantStyles,
        sizeStyles,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: textColor },
              size === 'sm' && { fontSize: TYPOGRAPHY.FONT_SIZE.SM },
              size === 'xl' && { fontSize: TYPOGRAPHY.FONT_SIZE.XXL },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
  },
  disabled: {
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;

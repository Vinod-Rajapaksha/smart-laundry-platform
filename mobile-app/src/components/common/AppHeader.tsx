import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = true,
  rightAction,
  onBackPress,
  style,
  transparent = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[
      styles.header, 
      transparent ? styles.transparent : styles.solid,
      style
    ]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity 
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeft color={COLORS.TEXT_PRIMARY} size={28} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.center}>
        {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
      </View>
      
      <View style={styles.right}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  solid: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
  },
});

export default AppHeader;

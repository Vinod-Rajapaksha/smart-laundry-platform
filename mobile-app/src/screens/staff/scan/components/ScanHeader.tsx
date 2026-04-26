import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Flashlight, X } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';

interface ScanHeaderProps {
  title: string;
  onFlashToggle?: () => void;
  flashActive?: boolean;
}

/**
 * Shared Header component for the Staff Scanning workflow.
 * Provides navigation and utility controls like flashlight.
 */
export const ScanHeader = ({ title, onFlashToggle, flashActive }: ScanHeaderProps) => {
  const router = useRouter();

  return (
    <View style={headerStyles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={headerStyles.iconBtn}
      >
        <ArrowLeft size={24} color={COLORS.WHITE} />
      </TouchableOpacity>

      <Text style={headerStyles.title}>{title}</Text>

      <TouchableOpacity
        onPress={onFlashToggle}
        style={[headerStyles.iconBtn, flashActive && headerStyles.activeIconBtn]}
      >
        <Flashlight
          size={24}
          color={flashActive ? COLORS.PRIMARY : COLORS.WHITE}
          fill={flashActive ? COLORS.PRIMARY : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBtn: {
    backgroundColor: COLORS.WHITE,
  }
});

export default ScanHeader;

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { QrCode } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';

/**
 * Animated Scan Icon for the scanning viewfinder.
 * Provides a high-tech "scanning" visual effect with corner brackets.
 */
export const ScanIcon = () => {
  return (
    <View style={iconStyles.container}>
      <View style={iconStyles.outline}>
        <QrCode size={180} color={COLORS.WHITE} opacity={0.6} strokeWidth={1} />

        {/* Scanning Scanner Beam Line (Simulated) */}
        <View style={iconStyles.beam} />

        {/* Corner Brackets */}
        <View style={[iconStyles.corner, iconStyles.topLeft]} />
        <View style={[iconStyles.corner, iconStyles.topRight]} />
        <View style={[iconStyles.corner, iconStyles.bottomLeft]} />
        <View style={[iconStyles.corner, iconStyles.bottomRight]} />
      </View>
    </View>
  );
};

const iconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  outline: {
    width: 240,
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  beam: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: 2,
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.WHITE,
    borderWidth: 5,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 24,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 24,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 24,
  }
});

export default ScanIcon;

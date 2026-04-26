import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCcw, XCircle } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

/**
 * Error overlay shown when a scan fails or an invalid QR is detected.
 * Provides clear messaging and a retry action.
 */
export const ErrorCard = ({ message, onRetry, onClose }: ErrorCardProps) => {
  return (
    <View style={errStyles.overlay}>
      <View style={errStyles.card}>
        <View style={errStyles.iconBox}>
          <AlertCircle size={48} color="#EF4444" fill="#FEF2F2" />
        </View>

        <Text style={errStyles.title}>SCAN FAILED</Text>
        <Text style={errStyles.message}>{message}</Text>

        <TouchableOpacity style={errStyles.retryBtn} onPress={onRetry}>
          <RefreshCcw size={20} color={COLORS.WHITE} style={{ marginRight: 8 }} />
          <Text style={errStyles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={errStyles.closeBtn} onPress={onClose}>
          <Text style={errStyles.closeBtnText}>Close Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const errStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  iconBox: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B91C1C',
    letterSpacing: 1.5,
  },
  message: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryBtn: {
    backgroundColor: COLORS.TEXT_PRIMARY,
    width: '100%',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    marginTop: 16,
    padding: 12,
  },
  closeBtnText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    fontWeight: '700',
  }
});

export default ErrorCard;

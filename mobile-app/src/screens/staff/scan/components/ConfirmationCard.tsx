import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, User, MapPin, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';

interface ConfirmationCardProps {
  orderId: string;
  customer: string;
  address: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'PICKUP' | 'DELIVERY';
}

/**
 * Result card shown after a successful scan.
 * Displays customer and order info for final verification.
 */
export const ConfirmationCard = ({ orderId, customer, address, onConfirm, onCancel, type }: ConfirmationCardProps) => {
  return (
    <View style={confStyles.overlay}>
      <View style={confStyles.card}>
        <View style={confStyles.successIcon}>
          <CheckCircle2 size={40} color={COLORS.SUCCESS} fill="#F0FDF4" />
        </View>

        <Text style={confStyles.title}>{type} VERIFIED</Text>
        <Text style={confStyles.orderId}>{orderId}</Text>

        <View style={confStyles.divider} />

        <View style={confStyles.infoRow}>
          <User size={18} color={COLORS.TEXT_SECONDARY} />
          <Text style={confStyles.infoText}>{customer}</Text>
        </View>

        <View style={confStyles.infoRow}>
          <MapPin size={18} color={COLORS.TEXT_SECONDARY} />
          <Text style={confStyles.infoText} numberOfLines={2}>{address}</Text>
        </View>

        <TouchableOpacity style={confStyles.confirmBtn} onPress={onConfirm}>
          <Text style={confStyles.confirmBtnText}>Confirm {type}</Text>
          <ChevronRight size={20} color={COLORS.WHITE} />
        </TouchableOpacity>

        <TouchableOpacity style={confStyles.cancelBtn} onPress={onCancel}>
          <Text style={confStyles.cancelBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const confStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.SUCCESS_TEXT,
    letterSpacing: 1,
  },
  orderId: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    flex: 1,
  },
  confirmBtn: {
    backgroundColor: COLORS.SUCCESS,
    width: '100%',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  confirmBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  cancelBtn: {
    marginTop: 16,
    padding: 12,
  },
  cancelBtnText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    fontWeight: '700',
  }
});

export default ConfirmationCard;

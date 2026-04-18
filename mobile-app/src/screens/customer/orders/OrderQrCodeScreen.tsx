import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, QrCode, ShieldCheck, Info } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen displaying a QR code for order verification.
 * Used by customers to confirm pickup or delivery with staff.
 */
const OrderQrCodeScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const header = (
    <View style={[styles.header, { backgroundColor: 'transparent' }]}>
      <TouchableOpacity onPress={() => router.back()} style={qrStyles.backButton}>
        <ArrowLeft size={24} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      statusBarColor={COLORS.PRIMARY}
      barStyle="light-content"
      style={{ backgroundColor: COLORS.PRIMARY }}
      header={header}
      scroll={false}
    >
      <View style={qrStyles.container}>
        <View style={qrStyles.card}>
          <Text style={qrStyles.cardTitle}>Confirmation QR</Text>
          <Text style={qrStyles.cardSubtitle}>Show this code to the staff during pickup</Text>

          {/* Mock QR Code UI */}
          <View style={qrStyles.qrWrapper}>
            <View style={qrStyles.qrOutline}>
              <QrCode size={200} color={COLORS.TEXT_PRIMARY} strokeWidth={1.5} />
            </View>
            
            {/* Corner Brackets */}
            <View style={[qrStyles.corner, qrStyles.topLeft]} />
            <View style={[qrStyles.corner, qrStyles.topRight]} />
            <View style={[qrStyles.corner, qrStyles.bottomLeft]} />
            <View style={[qrStyles.corner, qrStyles.bottomRight]} />
          </View>

          <View style={qrStyles.orderInfo}>
            <Text style={qrStyles.orderLabel}>ORDER ID</Text>
            <Text style={qrStyles.orderIdText}>{orderId || 'ORD-1234'}</Text>
          </View>

          <View style={qrStyles.securityBadge}>
            <ShieldCheck size={18} color={COLORS.SUCCESS} />
            <Text style={qrStyles.securityText}>Verified Secure Token</Text>
          </View>
        </View>

        <View style={qrStyles.instructions}>
          <Info size={20} color={COLORS.WHITE} opacity={0.8} />
          <Text style={qrStyles.instructionText}>
            This code is unique to your order. Do not share it until you meet our staff.
          </Text>
        </View>

        <TouchableOpacity 
          style={qrStyles.doneButton}
          onPress={() => router.back()}
        >
          <Text style={qrStyles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const qrStyles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },
  qrWrapper: {
    padding: 24,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    position: 'relative',
    marginBottom: 32,
  },
  qrOutline: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.PRIMARY,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  orderInfo: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1.5,
  },
  orderIdText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginTop: 4,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.SUCCESS_TEXT,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 10,
    gap: 12,
  },
  instructionText: {
    fontSize: 13,
    color: COLORS.WHITE,
    opacity: 0.9,
    flex: 1,
    lineHeight: 18,
  },
  doneButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  doneButtonText: {
    color: COLORS.WHITE,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default OrderQrCodeScreen;

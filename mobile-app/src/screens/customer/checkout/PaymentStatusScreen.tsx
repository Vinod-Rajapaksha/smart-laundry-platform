import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, QrCode, Download, CreditCard, Building2, Banknote } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import Divider from '../../../components/common/Divider';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Checkout.styles';

const PaymentStatusScreen = () => {
  const router = useRouter();
  const { success, orderId, method, total } = useLocalSearchParams();
  const isSuccess = success === 'true';

  const getMethodIcon = () => {
    switch (method) {
      case 'CARD': return <CreditCard size={16} color={COLORS.TEXT_SECONDARY} />;
      case 'BANK_TRANSFER': return <Building2 size={16} color={COLORS.TEXT_SECONDARY} />;
      case 'COD': return <Banknote size={16} color={COLORS.TEXT_SECONDARY} />;
      default: return <CreditCard size={16} color={COLORS.TEXT_SECONDARY} />;
    }
  };

  const getMethodLabel = () => {
    switch (method) {
      case 'CARD': return 'Visa •••• 4242';
      case 'BANK_TRANSFER': return 'Bank Transfer';
      case 'COD': return 'Cash on Delivery';
      default: return 'Online Payment';
    }
  };

  return (
    <ScreenWrapper
      header={<AppHeader title="Payment Status" showBack={false} />}
      statusBarColor={COLORS.WHITE}
      scroll
    >
      <View style={styles.statusContainer}>
        {/* Animated Check Circle */}
        <View style={styles.successCircle}>
          <Check color={COLORS.SUCCESS} size={64} strokeWidth={3} />
        </View>

        <Text style={styles.statusTitle}>Payment Successful</Text>
        <Text style={styles.statusMessage}>
          Your laundry order is being processed and will be ready for pickup soon.
        </Text>

        {/* Info Card */}
        <View style={[styles.card, { width: '100%', padding: 0, overflow: 'hidden' }]}>
          <View style={styles.receiptCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>Order ID</Text>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_PRIMARY, fontWeight: '700' }}>
                #{String(orderId).substring(0, 8).toUpperCase() || 'BW-9921'}
              </Text>
            </View>
            <Divider marginVertical={12} style={{ borderStyle: 'dotted' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>Amount Paid</Text>
              <Text style={{ fontSize: 18, color: COLORS.PRIMARY, fontWeight: '800' }}>
                Rs {total || '550.00'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>Payment Method</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {getMethodIcon()}
                <Text style={{ fontSize: 13, color: COLORS.TEXT_PRIMARY, marginLeft: 8, fontWeight: '600' }}>
                  {getMethodLabel()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ width: '100%', marginTop: 24 }}>
          <Button
            title="View QR Code"
            leftIcon={<QrCode color={COLORS.WHITE} size={20} />}
            onPress={() => router.push(`/(protected)/(customer)/orders/qr/${orderId}`)}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Download Receipt"
            variant="outline"
            leftIcon={<Download color={COLORS.PRIMARY} size={20} />}
            onPress={() => { }}
            style={{ marginBottom: 32, backgroundColor: '#0F172A', borderColor: '#0F172A' }}
            textStyle={{ color: COLORS.WHITE }}
          />

          <Button
            title="Back to Home"
            variant="primary"
            onPress={() => router.replace('/(protected)/(customer)/home')}
            style={{ height: 56 }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PaymentStatusScreen;

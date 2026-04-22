import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Info, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import styles from './styles/Checkout.styles';
import { paymentService } from '../../../services/customer/paymentService';

const CashOnDeliveryScreen = () => {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await paymentService.initCOD(orderId as string);

      router.push({
        pathname: '/(protected)/(customer)/checkout/payment-status',
        params: { success: 'true', orderId, method: 'COD', total }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper
      header={<AppHeader title="Confirm Order" />}
      footer={
        <View style={styles.footer}>
          <Button
            title="Confirm Order"
            rightIcon={<ArrowRight color={COLORS.WHITE} size={20} />}
            onPress={handleConfirm}
            size="lg"
            loading={loading}
          />
          <TouchableOpacity
            style={{ marginTop: 16, alignSelf: 'center' }}
            onPress={() => router.back()}
          >
            <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY, fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM }}>
              Cancel and go back
            </Text>
          </TouchableOpacity>
        </View>
      }
      statusBarColor={COLORS.WHITE}
      scroll
    >
      <View style={styles.content}>
        {/* Illustration */}
        <View style={{ alignItems: 'center', marginVertical: 32 }}>
          <View style={{ width: 220, height: 220, borderRadius: 32, backgroundColor: '#E0F2FE', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../../../assets/cod.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={styles.statusTitle}>Cash on Delivery</Text>
          <Text style={[styles.statusMessage, { marginBottom: 0 }]}>
            Your order for <Text style={{ fontWeight: 'bold' }}>B & W Laundry</Text> is ready to be processed.
          </Text>
        </View>

        {/* Info Box */}
        <View style={[styles.card, { backgroundColor: '#F8FAFC', borderColor: COLORS.BORDER_LIGHT }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.WHITE, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Info size={18} color={COLORS.TEXT_SECONDARY} />
            </View>
            <Text style={{ flex: 1, fontSize: 13, color: COLORS.TEXT_TERTIARY, lineHeight: 18 }}>
              Please have the exact amount ready for our delivery partner to ensure a smooth hand-off.
            </Text>
          </View>
        </View>

        {/* Price Breakdown Preview */}
        <View style={[styles.card, { borderStyle: 'dotted' }]}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>Rs {total || '0.00'}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>FREE</Text>
          </View>
          <View style={[styles.totalRow, { paddingTop: 12, marginTop: 4 }]}>
            <Text style={[styles.totalLabel, { fontSize: 16 }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { fontSize: 20 }]}>Rs {total || '0.00'}</Text>
          </View>
        </View>

        {/* Trust Badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <CheckCircle2 size={14} color={COLORS.TEXT_MUTED} />
          <Text style={{ fontSize: 11, color: COLORS.TEXT_MUTED, marginLeft: 6 }}>
            Secure payment confirmation
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

export default CashOnDeliveryScreen;

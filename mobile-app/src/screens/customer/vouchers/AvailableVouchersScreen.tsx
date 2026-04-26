import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ticket, Calendar, ChevronLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Vouchers.styles';
import api from '../../../services/api';
import { voucherService } from '../../../services/customer/voucherService';
import { notify } from '../../../utils/notify';

interface Voucher {
  _id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  voucherType: string;
  endDate: string;
}

const AvailableVouchersScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const orderTotal = parseFloat(params.total as string || '0');

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await api.get('/promotions');
      if (response.data.success) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (voucher: Voucher) => {
    if (orderTotal < voucher.minOrderAmount) {
      notify.error(
        'Ineligible',
        `This voucher requires a minimum order of Rs.${voucher.minOrderAmount.toFixed(2)}. Your current total is Rs.${orderTotal.toFixed(2)}.`
      );
      return;
    }

    try {
      setLoading(true);
      await voucherService.applyVoucherToOrder(orderId, voucher.code);

      notify.success('Success', 'Voucher applied successfully!');

      router.push({
        pathname: '/(protected)/(customer)/checkout/order-summary',
        params: { orderId }
      });
    } catch (error: any) {
      notify.error('Apply Failed', error.message || 'Could not apply voucher');
    } finally {
      setLoading(false);
    }
  };

  const renderVoucher = ({ item }: { item: Voucher }) => (
    <View style={styles.voucherCard}>
      <View style={styles.leftSection}>
        <Text style={styles.discountText}>
          {item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : `Rs.${item.discountValue}`}
        </Text>
        <Text style={styles.offText}>OFF</Text>
      </View>

      <View style={styles.dashedLine} />

      <View style={styles.rightSection}>
        <Text style={styles.voucherTitle}>{item.code}</Text>
        <Text style={styles.voucherDesc} numberOfLines={2}>
          Min. spend Rs.{item.minOrderAmount}. {item.voucherType === 'LOYALTY' ? 'Loyalty exclusive.' : 'Valid for all.'}
        </Text>

        <View style={styles.expiryContainer}>
          <Calendar size={14} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.expiryText}>
            Exp: {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.applyButton,
            orderTotal < item.minOrderAmount && { backgroundColor: COLORS.TEXT_MUTED }
          ]}
          onPress={() => handleApply(item)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Available Offers</Text>
      </View>
      <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 4, marginLeft: 36 }}>Save more on your laundry</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={vouchers}
          renderItem={renderVoucher}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Ticket size={80} color={COLORS.TEXT_SECONDARY} strokeWidth={1} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No vouchers available yet.</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default AvailableVouchersScreen;

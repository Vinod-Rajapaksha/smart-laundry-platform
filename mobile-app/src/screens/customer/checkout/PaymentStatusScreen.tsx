import { View, Text, ActivityIndicator, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Check, QrCode, Download, CreditCard, Building2, Banknote } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import Divider from '../../../components/common/Divider';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Checkout.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notify } from '../../../utils/notify';

const PaymentStatusScreen = () => {
  const router = useRouter();
  const { success, orderId, method, total } = useLocalSearchParams();
  const isSuccess = success === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const data = await orderService.getOrderById(orderId as string);
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const downloadReceipt = async () => {
    if (!orderId) return;
    setIsDownloading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const filename = `receipt-${order?.orderNo || orderId}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        orderService.getReceiptUrl(orderId as string),
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          notify.success('Success', 'Receipt downloaded successfully!');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      notify.error('Error', 'Failed to download receipt');
    } finally {
      setIsDownloading(false);
    }
  };

  const getMethodIcon = () => {
    const paymentMethod = order?.paymentMethod || method;
    switch (paymentMethod) {
      case 'CARD': return <CreditCard size={16} color={COLORS.TEXT_SECONDARY} />;
      case 'BANK_TRANSFER': return <Building2 size={16} color={COLORS.TEXT_SECONDARY} />;
      case 'COD': return <Banknote size={16} color={COLORS.TEXT_SECONDARY} />;
      default: return <CreditCard size={16} color={COLORS.TEXT_SECONDARY} />;
    }
  };

  const getMethodLabel = () => {
    const paymentMethod = order?.paymentMethod || method;
    switch (paymentMethod) {
      case 'CARD': return 'Card Payment';
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
              <Text style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>Order Number</Text>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              ) : (
                <Text style={{ fontSize: 13, color: COLORS.TEXT_PRIMARY, fontWeight: '700' }}>
                  {order?.orderNo || 'Loading...'}
                </Text>
              )}
            </View>
            <Divider marginVertical={12} style={{ borderStyle: 'dotted' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>Amount Paid</Text>
              <Text style={{ fontSize: 18, color: COLORS.PRIMARY, fontWeight: '800' }}>
                Rs {total}
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
            onPress={() => router.push({
              pathname: '/(protected)/(customer)/orders/qr-code',
              params: { orderId }
            })}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Download Receipt"
            variant="outline"
            leftIcon={<Download color={COLORS.PRIMARY} size={20} />}
            onPress={downloadReceipt}
            loading={isDownloading}
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

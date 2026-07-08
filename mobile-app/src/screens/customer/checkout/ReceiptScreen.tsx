import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Divider from '../../../components/common/Divider';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';
import Loading from '../../../components/common/Loading';

const ReceiptScreen = () => {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId as string);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order for receipt:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loading fullScreen />;
  if (!order) return null;

  return (
    <ScreenWrapper header={<AppHeader title="Transaction Receipt" />} scroll>
      <View style={styles.container}>
        <View style={styles.receipt}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.brand}>EcoShine</Text>
            <Text style={styles.regNo}>Reg No: BW-L-2024-001</Text>
          </View>

          <Divider marginVertical={24} style={{ borderStyle: 'dashed' }} />

          {/* Order Details */}
          <View style={styles.row}>
            <Text style={styles.label}>Order Number</Text>
            <Text style={styles.value}>{order.orderNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
          </View>

          <Divider marginVertical={24} />

          <View style={styles.row}>
            <Text style={styles.itemLabel}>Service Charge</Text>
            <Text style={styles.value}>Rs {order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Delivery Fee</Text>
            <Text style={styles.value}>Rs {order.deliveryFee.toFixed(2)}</Text>
          </View>

          <Divider marginVertical={24} style={{ borderStyle: 'dashed' }} />

          {/* Total */}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalValue}>Rs {order.totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.thankYou}>Thank you for choosing EcoShine!</Text>
            <Text style={styles.footerNote}>This is a computer-generated receipt.</Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  receipt: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    alignItems: 'center',
  },
  brand: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
  },
  regNo: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
  },
  value: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  thankYou: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    marginTop: 8,
    textAlign: 'center',
  }
});

export default ReceiptScreen;

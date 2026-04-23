import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, QrCode, MapPin, CreditCard, ShoppingBag, Clock, Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';

/**
 * Screen providing a comprehensive breakdown of a specific order.
 * Includes items list, service details, pricing, and status.
 */
const OrderDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const data = await orderService.getOrderById(orderId as string);
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Loading fullScreen />;
  if (!order) {
    return (
      <View style={detailStyles.errorContainer}>
        <Package size={64} color={COLORS.TEXT_MUTED} />
        <Text style={detailStyles.errorText}>Order not found</Text>
        <TouchableOpacity style={detailStyles.backButton} onPress={() => router.back()}>
          <Text style={detailStyles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'CANCELLED': return { bg: '#FEF2F2', text: '#DC2626' };
      case 'IN_WASH': return { bg: '#EFF6FF', text: '#2563EB' };
      default: return { bg: COLORS.PRIMARY_LIGHT, text: COLORS.PRIMARY };
    }
  };

  const statusColors = getStatusColor(order.status);

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Order Details</Text>
        </View>
        <TouchableOpacity 
          style={detailStyles.printButton}
          onPress={() => router.push({
            pathname: '/(protected)/(customer)/orders/qr-code',
            params: { orderId: order._id }
          })}
        >
          <QrCode size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        {/* Status Section */}
        <View style={detailStyles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={detailStyles.orderLabel}>Order Status</Text>
              <Text style={[detailStyles.orderValue, { color: statusColors.text }]}>
                {order.status.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <ShoppingBag size={20} color={statusColors.text} />
            </View>
          </View>
          <View style={detailStyles.divider} />
          <View style={detailStyles.iconRow}>
            <Clock size={16} color={COLORS.TEXT_SECONDARY} />
            <Text style={detailStyles.infoText}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>

        {/* Items Section */}
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={detailStyles.sectionCard}>
          {/* Main Service */}
          <View style={detailStyles.itemRow}>
            <View style={detailStyles.itemQuantity}>
              <Text style={detailStyles.quantityText}>{order.weightKg || 1}x</Text>
            </View>
            <Text style={detailStyles.itemName}>{(order.serviceId as any)?.name || 'Laundry Service'}</Text>
            <Text style={detailStyles.itemPrice}>LKR {order.subtotal.toFixed(2)}</Text>
          </View>

          {/* Options */}
          {order.options && order.options.map((option, index) => (
            <View key={index} style={detailStyles.itemRow}>
              <View style={detailStyles.itemQuantity}>
                <Text style={detailStyles.quantityText}>1x</Text>
              </View>
              <Text style={detailStyles.itemName}>{option.name}</Text>
              <Text style={detailStyles.itemPrice}>LKR {option.price.toFixed(2)}</Text>
            </View>
          ))}
          
          {order.extraFee > 0 && !order.options?.length && (
            <View style={detailStyles.itemRow}>
              <View style={detailStyles.itemQuantity}>
                <Text style={detailStyles.quantityText}>1x</Text>
              </View>
              <Text style={detailStyles.itemName}>Extra Charges</Text>
              <Text style={detailStyles.itemPrice}>LKR {order.extraFee.toFixed(2)}</Text>
            </View>
          )}
        </View>

        {/* Logistics Section */}
        <Text style={styles.sectionTitle}>Logistics & Payment</Text>
        <View style={detailStyles.sectionCard}>
          <View style={detailStyles.iconRow}>
            <MapPin size={18} color={COLORS.PRIMARY} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={detailStyles.labelSmall}>Address</Text>
              <Text style={detailStyles.infoText}>
                {order.pickupAddress || order.deliveryAddress || 'Self Service / In-Store'}
              </Text>
            </View>
          </View>
          <View style={[detailStyles.divider, { marginVertical: 16 }]} />
          <View style={detailStyles.iconRow}>
            <CreditCard size={18} color={COLORS.PRIMARY} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={detailStyles.labelSmall}>Payment Method</Text>
              <Text style={detailStyles.infoText}>
                {order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={[detailStyles.sectionCard, { marginTop: 10, backgroundColor: COLORS.PRIMARY }]}>
          <View style={detailStyles.summaryRow}>
            <Text style={detailStyles.summaryLabel}>Subtotal</Text>
            <Text style={detailStyles.summaryValue}>LKR {order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={detailStyles.summaryRow}>
            <Text style={detailStyles.summaryLabel}>Extra Charges</Text>
            <Text style={detailStyles.summaryValue}>LKR {order.extraFee.toFixed(2)}</Text>
          </View>
          <View style={detailStyles.summaryRow}>
            <Text style={detailStyles.summaryLabel}>Delivery Fee</Text>
            <Text style={detailStyles.summaryValue}>LKR {order.deliveryFee.toFixed(2)}</Text>
          </View>
          {(order.discountTotal || 0) > 0 && (
            <View style={detailStyles.summaryRow}>
              <Text style={detailStyles.summaryLabel}>Voucher Discount</Text>
              <Text style={[detailStyles.summaryValue, { color: '#BBF7D0' }]}>- LKR {order.discountTotal?.toFixed(2)}</Text>
            </View>
          )}
          <View style={[detailStyles.divider, { backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 }]} />
          <View style={detailStyles.summaryRow}>
            <Text style={[detailStyles.summaryLabel, { fontSize: 20, color: COLORS.WHITE }]}>Total Amount</Text>
            <Text style={[detailStyles.summaryValue, { fontSize: 24, color: COLORS.WHITE }]}>LKR {order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={detailStyles.qrButtonLarge}
          onPress={() => router.push({
            pathname: '/(protected)/(customer)/orders/qr-code',
            params: { orderId: order._id }
          })}
        >
          <QrCode size={22} color={COLORS.WHITE} style={{ marginRight: 10 }} />
          <Text style={detailStyles.qrButtonTextLarge}>View QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={detailStyles.trackButtonLarge}
          onPress={() => router.push({
            pathname: '/(protected)/(customer)/orders/tracking',
            params: { orderId: order._id }
          })}
        >
          <Clock size={22} color={COLORS.PRIMARY} style={{ marginRight: 10 }} />
          <Text style={detailStyles.trackButtonTextLarge}>Live Tracking</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const detailStyles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.BACKGROUND,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 16,
  },
  printButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  orderLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  orderValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemQuantity: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  trackButtonLarge: {
    backgroundColor: COLORS.WHITE,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginBottom: 40,
  },
  trackButtonTextLarge: {
    color: COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 16,
  },
  qrButtonLarge: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  qrButtonTextLarge: {
    color: COLORS.WHITE,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default OrderDetailsScreen;

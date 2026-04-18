import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Printer, MapPin, CreditCard, ShoppingBag, Clock } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen providing a comprehensive breakdown of a specific order.
 * Includes items list, service details, pricing, and status.
 */
const OrderDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Mock data for visual excellence
  const order = {
    id: orderId || 'ORD-1234',
    date: '24 May 2024, 10:00 AM',
    status: 'PROCESSING',
    service: 'Wash & Fold',
    address: 'No. 123, Luxury Apartments, Colombo 07',
    payment: 'Visa card ending in 4242',
    items: [
      { name: 'Casual Shirts', quantity: 5, price: 750.00 },
      { name: 'Trousers', quantity: 3, price: 450.00 },
      { name: 'Bed Sheets', quantity: 2, price: 500.00 },
    ],
    subtotal: 1700.00,
    deliveryFee: 150.00,
    discount: 200.00,
    total: 1650.00
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Order Details</Text>
        </View>
        <TouchableOpacity style={detailStyles.printButton}>
          <Printer size={20} color={COLORS.PRIMARY} />
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
              <Text style={detailStyles.orderValue}>{order.status}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
              <ShoppingBag size={20} color={COLORS.PRIMARY} />
            </View>
          </View>
          <View style={detailStyles.divider} />
          <View style={detailStyles.iconRow}>
            <Clock size={16} color={COLORS.TEXT_SECONDARY} />
            <Text style={detailStyles.infoText}>Placed on {order.date}</Text>
          </View>
        </View>

        {/* Items Section */}
        <Text style={detailStyles.sectionTitle}>Order Items</Text>
        <View style={detailStyles.sectionCard}>
          {order.items.map((item, index) => (
            <View key={index} style={detailStyles.itemRow}>
              <View style={detailStyles.itemQuantity}>
                <Text style={detailStyles.quantityText}>{item.quantity}x</Text>
              </View>
              <Text style={detailStyles.itemName}>{item.name}</Text>
              <Text style={detailStyles.itemPrice}>LKR {item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Logistics Section */}
        <Text style={detailStyles.sectionTitle}>Logistics & Payment</Text>
        <View style={detailStyles.sectionCard}>
          <View style={detailStyles.iconRow}>
            <MapPin size={18} color={COLORS.PRIMARY} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={detailStyles.labelSmall}>Delivery Address</Text>
              <Text style={detailStyles.infoText}>{order.address}</Text>
            </View>
          </View>
          <View style={[detailStyles.divider, { marginVertical: 16 }]} />
          <View style={detailStyles.iconRow}>
            <CreditCard size={18} color={COLORS.PRIMARY} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={detailStyles.labelSmall}>Payment Method</Text>
              <Text style={detailStyles.infoText}>{order.payment}</Text>
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
            <Text style={detailStyles.summaryLabel}>Delivery Fee</Text>
            <Text style={detailStyles.summaryValue}>LKR {order.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={detailStyles.summaryRow}>
            <Text style={detailStyles.summaryLabel}>Voucher Discount</Text>
            <Text style={[detailStyles.summaryValue, { color: '#BBF7D0' }]}>- LKR {order.discount.toFixed(2)}</Text>
          </View>
          <View style={[detailStyles.divider, { backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 }]} />
          <View style={detailStyles.summaryRow}>
            <Text style={[detailStyles.summaryLabel, { fontSize: 20, color: COLORS.WHITE }]}>Total Amount</Text>
            <Text style={[detailStyles.summaryValue, { fontSize: 24, color: COLORS.WHITE }]}>LKR {order.total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={detailStyles.trackButtonLarge}
          onPress={() => router.push({
            pathname: '/(protected)/(customer)/orders/tracking',
            params: { orderId: order.id }
          })}
        >
          <Text style={detailStyles.trackButtonTextLarge}>Live Tracking</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const detailStyles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    marginLeft: 4,
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
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginBottom: 40,
  },
  trackButtonTextLarge: {
    color: COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default OrderDetailsScreen;

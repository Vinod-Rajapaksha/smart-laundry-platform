import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, MapPin, CheckCircle2, Circle, Package, AlertCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order, OrderStatus } from '../../../types/order.types';
import { subscribeToOrderStatus, unsubscribeFromOrderStatus } from '../../../services/socketService';

const OrderTrackingScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        const data = await orderService.getOrderById(orderId as string);
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    // Subscribe to real-time updates
    subscribeToOrderStatus((data: any) => {
      // If the update is for this specific order, refresh the data
      if (data.orderId === orderId) {
        fetchOrderDetails();
      }
    });

    return () => {
      unsubscribeFromOrderStatus();
    };
  }, [orderId]);

  if (loading) return <Loading fullScreen />;
  if (!order) {
    return (
      <View style={trackingStyles.errorContainer}>
        <Package size={64} color={COLORS.TEXT_MUTED} />
        <Text style={trackingStyles.errorText}>Order not found</Text>
        <TouchableOpacity style={trackingStyles.backButton} onPress={() => router.back()}>
          <Text style={trackingStyles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Define the ordered steps for tracking
  const ORDER_STATUS_STEPS: { status: OrderStatus; title: string }[] = [
    { status: 'PENDING', title: 'Order Placed' },
    { status: 'CONFIRMED', title: 'Order Confirmed' },
    { status: 'PICKUP_SCHEDULED', title: 'Pickup Scheduled' },
    { status: 'PICKED_UP', title: 'Picked Up' },
    { status: 'IN_WASH', title: 'Laundry in Progress' },
    { status: 'READY_FOR_DELIVERY', title: 'Ready for Delivery' },
    { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery' },
    { status: 'DELIVERED', title: 'Delivered' },
  ];

  // Helper to check if a status has been completed
  const isStatusReached = (status: OrderStatus) => {
    if (!order) return false;
    return (order.trackingLogs || []).some(log => log.status === status) || order.status === status;
  };

  // Helper to get time for a status
  const getStatusTime = (status: OrderStatus) => {
    if (!order) return null;
    const log = (order.trackingLogs || []).find(l => l.status === status);
    if (!log) return null;
    return new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const steps = ORDER_STATUS_STEPS.map((step) => ({
    ...step,
    completed: isStatusReached(step.status),
    current: order.status === step.status,
    time: getStatusTime(step.status) || (order.status === step.status ? 'Ongoing' : 'Pending')
  }));

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Track Order</Text>
      </View>
      <Text style={{ color: COLORS.TEXT_SECONDARY, fontSize: 14 }}>Order ID: #{order.orderNo || order._id.substring(0, 8).toUpperCase()}</Text>
    </View>
  );

  return (
    <ScreenWrapper
      style={styles.safeArea}
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        {/* Live Status Header */}
        <View style={trackingStyles.statusCard}>
          <View style={[trackingStyles.iconCircle, order.status === 'CANCELLED' && { backgroundColor: COLORS.ERROR_BACKGROUND }]}>
            {order.status === 'CANCELLED' ? (
              <AlertCircle size={32} color={COLORS.ERROR} />
            ) : (
              <Clock size={32} color={COLORS.PRIMARY} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={trackingStyles.statusLabel}>Current Status</Text>
            <Text style={[trackingStyles.statusValue, order.status === 'CANCELLED' && { color: COLORS.ERROR }]}>
              {order.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        {order.status === 'CANCELLED' && (
          <View style={[trackingStyles.statusCard, { backgroundColor: COLORS.ERROR_BACKGROUND, borderColor: COLORS.ERROR_BORDER }]}>
            <Text style={{ color: COLORS.ERROR_TEXT, fontWeight: '600' }}>
              This order has been cancelled. Please contact support for more information.
            </Text>
          </View>
        )}

        {/* Tracking Steps */}
        <View style={trackingStyles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={trackingStyles.stepRow}>
              <View style={trackingStyles.indicatorContainer}>
                {step.completed ? (
                  <CheckCircle2 size={24} color={COLORS.PRIMARY} fill={COLORS.PRIMARY_LIGHT} />
                ) : (
                  <Circle size={24} color={COLORS.BORDER} />
                )}
                {index < steps.length - 1 && (
                  <View style={[
                    trackingStyles.line,
                    { backgroundColor: step.completed ? COLORS.PRIMARY : COLORS.BORDER }
                  ]} />
                )}
              </View>

              <View style={[
                trackingStyles.content,
                step.current && trackingStyles.currentContent
              ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    trackingStyles.stepTitle,
                    step.completed && { color: COLORS.TEXT_PRIMARY },
                    step.current && { color: COLORS.PRIMARY }
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={trackingStyles.stepTime}>{step.time}</Text>
                </View>
                {step.current && (
                  <View style={trackingStyles.liveBadge}>
                    <Text style={trackingStyles.liveBadgeText}>ONGOING</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Location Info */}
        <View style={[styles.orderCard, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <View style={styles.detailRow}>
            <MapPin size={18} color={COLORS.PRIMARY} />
            <Text style={styles.detailText}>
              {order.pickupAddress || order.deliveryAddress || 'Self Service / In-Store Pickup'}
            </Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const trackingStyles = StyleSheet.create({
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 4,
  },
  stepsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 80,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 24,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 24,
  },
  currentContent: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_MUTED,
  },
  stepTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '800',
  }
});

export default OrderTrackingScreen;

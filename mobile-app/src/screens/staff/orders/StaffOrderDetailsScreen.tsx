import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, Phone, Package, Clock, ChevronRight,
  CheckCircle2, Navigation2, ClipboardCheck,
  Info, CheckCircle, Circle
} from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { staffOrderService, StaffOrder } from '../../../services/staff/staffOrderService';
import { notify } from '../../../utils/notify';
import { LinearGradient } from 'expo-linear-gradient';

const StaffOrderDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<StaffOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await staffOrderService.getOrderById(orderId as string);
      setOrder(data);
    } catch (error: any) {
      notify.error('Error', error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (order?.userId?.telephone) {
      Linking.openURL(`tel:${order.userId.telephone}`);
    }
  };

  const handleClaim = async () => {
    try {
      setUpdating(true);
      await staffOrderService.claimOrder(orderId as string);
      notify.success('Success', 'Order claimed successfully');
      loadOrderDetails();
    } catch (error: any) {
      notify.error('Claim Failed', error.message || 'Could not claim order');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (nextStatus: string) => {
    try {
      setUpdating(true);
      await staffOrderService.updateOrderStatus(orderId as string, nextStatus);
      notify.success('Updated', `Order status moved to ${nextStatus.replace(/_/g, ' ')}`);
      loadOrderDetails();
    } catch (error: any) {
      notify.error('Update Failed', error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getActionConfig = () => {
    if (!order) return null;

    switch (order.status) {
      case 'ORDER_PLACED':
        if (!order.staffId) {
          return { label: 'Claim Pickup', action: handleClaim, color: COLORS.PRIMARY, icon: <ClipboardCheck size={22} color={COLORS.WHITE} /> };
        }
        return null;

      case 'PICKUP_ASSIGNED':
      case 'PICKUP_ON_THE_WAY':
        return { 
          label: 'Start Tracking', 
          action: () => router.push({ pathname: '/(protected)/(staff)/orders/tracking', params: { orderId: order._id } }), 
          color: COLORS.PRIMARY,
          icon: <Navigation2 size={22} color={COLORS.WHITE} />
        };

      case 'PICKUP_ARRIVED':
        return { 
          label: 'Scan for Pickup', 
          action: () => router.push({ pathname: '/(protected)/(staff)/(tabs)/scan', params: { orderId: order._id } }), 
          color: COLORS.SUCCESS,
          icon: <CheckCircle2 size={22} color={COLORS.WHITE} />
        };

      case 'PICKED_UP':
        return { label: 'Handover to Laundry', action: () => handleStatusUpdate('HANDED_OVER'), color: '#8B5CF6', icon: <Package size={22} color={COLORS.WHITE} /> };

      case 'HANDED_OVER':
      case 'WASHING':
      case 'DRYING':
        return { label: 'Waiting for Laundry', action: () => {}, color: COLORS.TEXT_MUTED, icon: <Clock size={22} color={COLORS.WHITE} />, disabled: true };

      case 'READY':
        if (!order.staffId) {
          return { label: 'Claim Delivery', action: handleClaim, color: COLORS.PRIMARY, icon: <ClipboardCheck size={22} color={COLORS.WHITE} /> };
        }
        return { 
          label: 'Start Tracking', 
          action: () => router.push({ pathname: '/(protected)/(staff)/orders/tracking', params: { orderId: order._id } }), 
          color: COLORS.PRIMARY,
          icon: <Navigation2 size={22} color={COLORS.WHITE} />
        };

      case 'DELIVERY_ASSIGNED':
      case 'DELIVERY_ON_THE_WAY':
        return { 
          label: 'Start Tracking', 
          action: () => router.push({ pathname: '/(protected)/(staff)/orders/tracking', params: { orderId: order._id } }), 
          color: COLORS.PRIMARY,
          icon: <Navigation2 size={22} color={COLORS.WHITE} />
        };

      case 'DELIVERY_ARRIVED':
        return { 
          label: 'Scan for Delivery', 
          action: () => router.push({ pathname: '/(protected)/(staff)/(tabs)/scan', params: { orderId: order._id } }), 
          color: COLORS.SUCCESS,
          icon: <CheckCircle2 size={22} color={COLORS.WHITE} />
        };

      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  const getStatusColor = (status: string) => {
    if (status === 'DELIVERED') return '#10B981';
    if (status.includes('ASSIGNED')) return COLORS.PRIMARY;
    if (status.includes('WAY')) return '#F59E0B';
    if (status === 'HANDED_OVER' || status === 'WASHING' || status === 'DRYING') return '#8B5CF6';
    return COLORS.TEXT_SECONDARY;
  };

  const header = (
    <LinearGradient
      colors={[COLORS.PRIMARY, '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={redesignStyles.headerGradient}
    >
      <View style={redesignStyles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={redesignStyles.backBtn}>
          <ArrowLeft size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={redesignStyles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={redesignStyles.infoBtn}>
          <Info size={22} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>
      <View style={redesignStyles.headerSummary}>
        <View>
          <Text style={redesignStyles.orderNoText}>#{order?.orderNo || '------'}</Text>
          <Text style={redesignStyles.dateText}>Placed on {order ? new Date(order.createdAt).toLocaleDateString() : '--/--/----'}</Text>
        </View>
        <View style={[redesignStyles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={redesignStyles.statusText}>
            {order?.status?.replace(/_/g, ' ') || 'LOADING'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={redesignStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={redesignStyles.loadingText}>Fetching order data...</Text>
      </View>
    );
  }

  if (!order) return null;

  return (
    <ScreenWrapper
      header={header}
      scroll={true}
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <View style={redesignStyles.container}>
        {/* Progress Stepper */}
        <View style={redesignStyles.stepperContainer}>
          <Text style={redesignStyles.sectionLabel}>Workflow Progress</Text>
          <View style={redesignStyles.stepperRow}>
            <Step active={true} completed={['PICKED_UP', 'HANDED_OVER', 'WASHING', 'DRYING', 'READY', 'DELIVERED', 'PICKUP_ARRIVED', 'DELIVERY_ARRIVED'].includes(order.status)} label="Pickup" />
            <Connector active={['PICKED_UP', 'HANDED_OVER', 'WASHING', 'DRYING', 'READY', 'DELIVERED', 'PICKUP_ARRIVED', 'DELIVERY_ARRIVED'].includes(order.status)} />
            <Step
              active={['HANDED_OVER', 'WASHING', 'DRYING'].includes(order.status)}
              completed={['READY', 'DELIVERED'].includes(order.status)}
              label="Laundry"
            />
            <Connector active={['READY', 'DELIVERED'].includes(order.status)} />
            <Step active={['READY', 'DELIVERY_ASSIGNED', 'DELIVERED', 'DELIVERY_ARRIVED'].includes(order.status)} completed={order.status === 'DELIVERED'} label="Delivery" />
          </View>
        </View>

        {/* Action Button - Moved up for high visibility */}
        {actionConfig && (
          <TouchableOpacity
            style={[redesignStyles.mainActionBtn, { backgroundColor: actionConfig.color }]}
            onPress={actionConfig.action}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <>
                {actionConfig.icon}
                <Text style={redesignStyles.mainActionText}>{actionConfig.label}</Text>
                <ChevronRight size={20} color={COLORS.WHITE} />
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Customer Card */}
        <View style={redesignStyles.card}>
          <View style={redesignStyles.cardHeader}>
            <View style={redesignStyles.customerInfo}>
              <View style={redesignStyles.avatar}>
                <Text style={redesignStyles.avatarText}>{order.userId?.name[0] || 'C'}</Text>
              </View>
              <View style={{ marginLeft: 16 }}>
                <Text style={redesignStyles.custName}>{order.userId?.name}</Text>
                <Text style={redesignStyles.custSub}>Premium Customer</Text>
              </View>
            </View>
            <TouchableOpacity style={redesignStyles.callCircle} onPress={handleCall}>
              <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
            </TouchableOpacity>
          </View>

          <View style={redesignStyles.divider} />

          <View style={redesignStyles.locationContainer}>
            <View style={redesignStyles.locationRow}>
              <View style={[redesignStyles.dot, { backgroundColor: COLORS.PRIMARY }]} />
              <View style={{ flex: 1 }}>
                <Text style={redesignStyles.locationLabel}>Pickup Point</Text>
                <Text style={redesignStyles.locationValue}>{order.pickupAddress}</Text>
              </View>
            </View>
            <View style={redesignStyles.pathLine} />
            <View style={redesignStyles.locationRow}>
              <View style={[redesignStyles.dot, { backgroundColor: '#10B981' }]} />
              <View style={{ flex: 1 }}>
                <Text style={redesignStyles.locationLabel}>Delivery Destination</Text>
                <Text style={redesignStyles.locationValue}>{order.deliveryAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Details Card */}
        <View style={redesignStyles.card}>
          <Text style={redesignStyles.cardTitle}>Service Package</Text>
          <View style={redesignStyles.detailRow}>
            <View style={redesignStyles.detailIconBox}>
              <Package size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={redesignStyles.detailLabel}>Service Type</Text>
              <Text style={redesignStyles.detailValue}>{order.serviceId?.name || 'Standard Laundry'}</Text>
            </View>
          </View>

          <View style={redesignStyles.detailRow}>
            <View style={redesignStyles.detailIconBox}>
              <Clock size={20} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={redesignStyles.detailLabel}>Estimated Payout</Text>
              <Text style={[redesignStyles.detailValue, { color: '#10B981', fontWeight: '800' }]}>
                Rs {order.totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer info */}
        {order.status === 'DELIVERED' && (
          <View style={redesignStyles.completedCard}>
            <LinearGradient
              colors={['#DCFCE7', '#F0FDF4']}
              style={redesignStyles.completedGradient}
            >
              <CheckCircle size={40} color="#10B981" />
              <Text style={redesignStyles.completedTitle}>Delivery Successful</Text>
              <Text style={redesignStyles.completedSub}>This order has been finalized and closed.</Text>
            </LinearGradient>
          </View>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

const Step = ({ active, completed, label }: any) => (
  <View style={redesignStyles.stepWrapper}>
    <View style={[
      redesignStyles.stepCircle,
      active && redesignStyles.stepActive,
      completed && redesignStyles.stepCompleted
    ]}>
      {completed ? (
        <CheckCircle size={14} color={COLORS.WHITE} />
      ) : (
        <Circle size={14} color={active ? COLORS.PRIMARY : '#E2E8F0'} />
      )}
    </View>
    <Text style={[redesignStyles.stepLabel, active && redesignStyles.stepLabelActive]}>{label}</Text>
  </View>
);

const Connector = ({ active }: any) => (
  <View style={[redesignStyles.connector, active && redesignStyles.connectorActive]} />
);

const redesignStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.WHITE,
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderNoText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.WHITE,
    letterSpacing: -1,
  },
  dateText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  container: {
    padding: 20,
  },
  stepperContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  stepWrapper: {
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepActive: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  stepCompleted: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
  },
  stepLabelActive: {
    color: COLORS.PRIMARY,
  },
  connector: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginTop: -20,
    marginHorizontal: -15,
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  mainActionBtn: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  mainActionText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.PRIMARY,
  },
  custName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  custSub: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  callCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  locationContainer: {
    marginTop: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 16,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    lineHeight: 20,
  },
  pathLine: {
    width: 2,
    height: 30,
    backgroundColor: '#F1F5F9',
    marginLeft: 5,
    marginVertical: -5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    marginTop: 2,
  },
  completedCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  completedGradient: {
    alignItems: 'center',
    padding: 30,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 16,
  },
  completedSub: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  }
});

export default StaffOrderDetailsScreen;

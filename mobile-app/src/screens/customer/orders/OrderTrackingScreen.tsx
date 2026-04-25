import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, MapPin, CheckCircle2, Circle, Package, AlertCircle } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order, OrderStatus } from '../../../types/order.types';
import { subscribeToOrderStatus, unsubscribeFromOrderStatus, subscribeToStaffLocation, unsubscribeFromStaffLocation } from '../../../services/socketService';

const OrderTrackingScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [staffLocation, setStaffLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<MapView>(null);

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

    subscribeToOrderStatus((data: any) => {
      if (data.orderId === orderId) {
        fetchOrderDetails();
      }
    });

    subscribeToStaffLocation((data: any) => {
      if (data.orderId === orderId && data.location) {
        setStaffLocation(data.location);
      }
    });

    return () => {
      unsubscribeFromOrderStatus();
      unsubscribeFromStaffLocation();
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

  const ORDER_STATUS_STEPS = [
    { key: 'PLACED', title: 'Order Placed', statuses: ['ORDER_PLACED'], icon: <Package size={18} color={COLORS.PRIMARY} /> },
    { key: 'PICKUP_ASSIGNED', title: 'Rider Assigned', statuses: ['PICKUP_ASSIGNED'], icon: <CheckCircle2 size={18} color={COLORS.PRIMARY} /> },
    { key: 'PICKUP_WAY', title: 'Rider Arriving', statuses: ['PICKUP_ON_THE_WAY', 'PICKUP_ARRIVED'], icon: <MapPin size={18} color={COLORS.PRIMARY} /> },
    { key: 'PICKED_UP', title: 'Picked Up', statuses: ['PICKED_UP'], icon: <Package size={18} color={COLORS.PRIMARY} /> },
    { key: 'HANDED_OVER', title: 'At Laundry', statuses: ['HANDED_OVER'], icon: <CheckCircle2 size={18} color={COLORS.PRIMARY} /> },
    { key: 'PROCESSING', title: 'Cleaning & Drying', statuses: ['WASHING', 'DRYING', 'PROCESSING'], icon: <Clock size={18} color={COLORS.PRIMARY} /> },
    { key: 'READY', title: 'Ready for Delivery', statuses: ['READY'], icon: <CheckCircle2 size={18} color={COLORS.PRIMARY} /> },
    { key: 'DELIVERY_ASSIGNED', title: 'Delivery Rider Assigned', statuses: ['DELIVERY_ASSIGNED'], icon: <CheckCircle2 size={18} color={COLORS.PRIMARY} /> },
    { key: 'DELIVERY_WAY', title: 'Out for Delivery', statuses: ['DELIVERY_ON_THE_WAY', 'DELIVERY_ARRIVED'], icon: <MapPin size={18} color={COLORS.PRIMARY} /> },
    { key: 'DELIVERED', title: 'Delivered', statuses: ['DELIVERED'], icon: <CheckCircle2 size={18} color={COLORS.PRIMARY} /> },
  ];

  const isStepReached = (stepStatuses: string[]) => {
    if (!order) return false;
    const allStatuses = [
      'ORDER_PLACED',
      'PICKUP_ASSIGNED', 'PICKUP_ON_THE_WAY', 'PICKUP_ARRIVED', 'PICKED_UP',
      'HANDED_OVER', 'WASHING', 'DRYING', 'PROCESSING', 'READY',
      'DELIVERY_ASSIGNED', 'DELIVERY_ON_THE_WAY', 'DELIVERY_ARRIVED', 'DELIVERED'
    ];

    const currentIndex = allStatuses.indexOf(order.status);
    const stepIndices = stepStatuses.map(s => allStatuses.indexOf(s));

    return currentIndex >= Math.max(...stepIndices) || stepStatuses.includes(order.status);
  };

  const getStepTime = (stepStatuses: string[]) => {
    if (!order || !order.trackingLogs) return null;
    const log = order.trackingLogs.find(l => stepStatuses.includes(l.status));
    if (!log) return null;
    return new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const steps = ORDER_STATUS_STEPS.map((step) => ({
    ...step,
    completed: isStepReached(step.statuses),
    current: step.statuses.includes(order.status),
    time: getStepTime(step.statuses) || (step.statuses.includes(order.status) ? 'Ongoing' : 'Pending')
  }));

  const isRiderMoving = [
    'PICKUP_ON_THE_WAY', 'DELIVERY_ON_THE_WAY'
  ].includes(order.status);

  const isPickup = [
    'ORDER_PLACED', 'PICKUP_ASSIGNED', 'PICKUP_ON_THE_WAY', 'PICKUP_ARRIVED'
  ].includes(order.status);

  const destLat = isPickup ? order.pickupLat : order.deliveryLat;
  const destLng = isPickup ? order.pickupLng : order.deliveryLng;

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Track Order</Text>
      </View>
      <Text style={{ color: COLORS.TEXT_SECONDARY, fontSize: 14 }}>Order Number: #{order.orderNo}</Text>
    </View>
  );

  return (
    <ScreenWrapper
      style={styles.safeArea}
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
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

        {isRiderMoving && (
          <TouchableOpacity
            style={[trackingStyles.viewMapBtn, showMap && { backgroundColor: COLORS.TEXT_PRIMARY }]}
            onPress={() => setShowMap(!showMap)}
          >
            <MapPin size={20} color={COLORS.WHITE} />
            <Text style={trackingStyles.viewMapBtnText}>
              {showMap ? 'Close Live Tracking' : 'Track Rider Live Location'}
            </Text>
          </TouchableOpacity>
        )}

        {showMap && isRiderMoving && destLat && destLng && (
          <View style={trackingStyles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              mapType="none"
              initialRegion={{
                latitude: staffLocation?.lat || destLat,
                longitude: staffLocation?.lng || destLng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <UrlTile
                urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />

              <Marker coordinate={{ latitude: destLat, longitude: destLng }} title="Your Location">
                <MapPin size={34} color={COLORS.PRIMARY} fill={COLORS.PRIMARY_LIGHT} />
              </Marker>
              {staffLocation && (
                <Marker coordinate={{ latitude: staffLocation.lat, longitude: staffLocation.lng }} title="Driver Location">
                  <View style={trackingStyles.staffPin}>
                    <View style={trackingStyles.staffPinInner} />
                  </View>
                </Marker>
              )}
            </MapView>
            <View style={trackingStyles.liveIndicator}>
              <View style={trackingStyles.liveDot} />
              <Text style={trackingStyles.liveText}>Live Tracking</Text>
            </View>
          </View>
        )}

        {/* Tracking Steps */}
        <View style={trackingStyles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={trackingStyles.stepRow}>
              <View style={trackingStyles.indicatorContainer}>
                {step.completed ? (
                  <View style={trackingStyles.completedIcon}>
                    {step.icon}
                  </View>
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
  mapWrapper: {
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  staffPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffPinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ERROR,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  viewMapBtn: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    gap: 10,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  viewMapBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
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
  completedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4, // Center against the 24px container
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

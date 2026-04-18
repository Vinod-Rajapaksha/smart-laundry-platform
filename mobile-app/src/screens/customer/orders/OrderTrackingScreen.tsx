import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, MapPin, CheckCircle2, Circle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen providing real-time tracking for a specific order.
 * Features a vertical step indicator and detailed order status.
 */
const OrderTrackingScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const steps = [
    { title: 'Order Placed', time: '10:00 AM', completed: true, current: false },
    { title: 'Picked Up', time: '10:30 AM', completed: true, current: false },
    { title: 'Processing', time: '11:15 AM', completed: true, current: true },
    { title: 'Quality Check', time: 'Pending', completed: false, current: false },
    { title: 'Out for Delivery', time: 'Pending', completed: false, current: false },
    { title: 'Delivered', time: 'Pending', completed: false, current: false },
  ];

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Track Order</Text>
      </View>
      <Text style={{ color: COLORS.TEXT_SECONDARY, fontSize: 14 }}>Order ID: {orderId || 'ORD-1234'}</Text>
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
          <View style={trackingStyles.iconCircle}>
            <Clock size={32} color={COLORS.PRIMARY} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={trackingStyles.statusLabel}>Estimated Completion</Text>
            <Text style={trackingStyles.statusValue}>Today, 04:30 PM</Text>
          </View>
        </View>

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
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.detailRow}>
            <MapPin size={18} color={COLORS.PRIMARY} />
            <Text style={styles.detailText}>No. 123, Luxury Apartments, Colombo 07</Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const trackingStyles = StyleSheet.create({
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

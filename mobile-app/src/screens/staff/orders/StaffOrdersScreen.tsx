import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MapPin, Navigation, Clock, Package, Tag, ExternalLink, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { staffOrderService, StaffOrder } from '../../../services/staff/staffOrderService';
import { notify } from '../../../utils/notify';

/**
 * Orchestrator Screen for Staff Orders.
 * Dynamically switches between:
 * 1. Assigned Orders (My Tasks) - If active assignments exist.
 * 2. Available Orders - If no active tasks, allowing them to claim new ones.
 */
const StaffOrdersScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState<StaffOrder[]>([]);
  const [availableOrders, setAvailableOrders] = useState<StaffOrder[]>([]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // 1. Check for assigned tasks first
      const assigned = await staffOrderService.getAssignedTasks();
      setAssignedTasks(assigned);

      // 2. If no assigned tasks, fetch available orders
      if (assigned.length === 0) {
        const available = await staffOrderService.getAvailableOrders();
        setAvailableOrders(available);
      }
    } catch (error) {
      notify.error('Fetch Error', 'Failed to load order data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleClaim = async (orderId: string) => {
    try {
      notify.info('Processing', 'Claiming order...');
      await staffOrderService.claimOrder(orderId);
      notify.success('Success', 'Order assigned to you!');
      // Refresh to switch to Assigned view
      loadAllData();
    } catch (error: any) {
      notify.error('Claim Failed', error.message || 'Could not claim this order');
    }
  };

  const renderAssignedTask = ({ item }: { item: StaffOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>#{item.orderNo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statusText, { color: '#92400E' }]}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userId?.name[0]}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.customerName}>{item.userId?.name}</Text>
          <Text style={styles.customerPhone}>{item.userId?.telephone}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText} numberOfLines={2}>
          {item.status.includes('PICKUP') ? item.pickupAddress : item.deliveryAddress}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => router.push({
            pathname: '/(protected)/(staff)/orders/StaffOrderDetailsScreen',
            params: { orderId: item._id }
          })}
        >
          <Text style={styles.secondaryActionText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push({
            pathname: '/(protected)/(staff)/orders/TrackingScreen',
            params: { orderId: item._id }
          })}
        >
          <Navigation size={18} color={COLORS.WHITE} />
          <Text style={styles.primaryActionText}>Start Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAvailableOrder = ({ item }: { item: StaffOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>#{item.orderNo}</Text>
        <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '800' }}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={styles.avatar}>
           <Text style={styles.avatarText}>{item.userId?.name[0] || 'C'}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.customerName}>{item.userId?.name || 'Customer'}</Text>
          <Text style={styles.customerPhone}>{item.serviceId?.name || 'Laundry Service'}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText} numberOfLines={1}>{item.pickupAddress || item.deliveryAddress}</Text>
      </View>

      <View style={styles.actionRow}>
        <View>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>PAYOUT</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.SUCCESS_TEXT }}>Rs {item.totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => handleClaim(item._id)}
        >
          <ExternalLink size={18} color={COLORS.WHITE} />
          <Text style={styles.primaryActionText}>Claim Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const header = (
    <View style={styles.header}>
      <Text style={styles.sectionTitle}>
        {assignedTasks.length > 0 ? 'My Active Tasks' : 'Available for Pickup'}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper header={header} scroll={false}>
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={assignedTasks.length > 0 ? assignedTasks : availableOrders}
          renderItem={assignedTasks.length > 0 ? renderAssignedTask : renderAvailableOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Package size={64} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>
                {assignedTasks.length > 0 ? 'No active tasks found' : 'No available orders to claim'}
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default StaffOrdersScreen;
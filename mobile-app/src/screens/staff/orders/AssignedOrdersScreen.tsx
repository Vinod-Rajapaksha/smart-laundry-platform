import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, MapPin, Navigation, Clock, Package } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { staffOrderService, StaffOrder } from '../../../services/staff/staffOrderService';
import { notify } from '../../../utils/notify';

/**
 * Screen for Staff to view and manage orders currently assigned to them.
 * Provides quick access to navigation and status updates.
 */
const AssignedOrdersScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<StaffOrder[]>([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await staffOrderService.getAssignedTasks();
      setTasks(data);
    } catch (error) {
      notify.error('Fetch Error', 'Failed to load your tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const renderTask = ({ item }: { item: StaffOrder }) => (
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

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Package size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={{ fontSize: 13, color: COLORS.TEXT_PRIMARY }}>{item.serviceId?.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Clock size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={{ fontSize: 13, color: COLORS.TEXT_PRIMARY }}>Updated {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
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
          <Navigation size={18} color={COLORS.WHITE} style={{ marginRight: 6 }} />
          <Text style={styles.primaryActionText}>Start Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>My Current Tasks</Text>
      </View>
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
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Package size={64} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No active tasks at the moment.</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default AssignedOrdersScreen;

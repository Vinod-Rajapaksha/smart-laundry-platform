import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, MapPin, Package, Clock, Tag, ExternalLink } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { staffOrderService, StaffOrder } from '../../../services/staff/staffOrderService';
import { notify } from '../../../utils/notify';

/**
 * Screen for Staff to browse and claim new orders available for pickup.
 * Features a high-visibility queue with location and payout info.
 */
const AvailableOrdersScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<StaffOrder[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await staffOrderService.getAvailableOrders();
      setOrders(data);
    } catch (error) {
      notify.error('Fetch Error', 'Failed to load available orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleClaim = async (orderId: string) => {
    try {
      notify.info('Processing', 'Claiming order...');
      await staffOrderService.claimOrder(orderId);
      notify.success('Success', 'Order assigned to you!');
      // Navigate to tracking for this order
      router.push({
        pathname: '/(protected)/(staff)/orders/TrackingScreen',
        params: { orderId }
      });
    } catch (error: any) {
      notify.error('Claim Failed', error.message || 'Could not claim this order');
    }
  };

  const renderAvailableOrder = ({ item }: { item: StaffOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>#{item.orderNo}</Text>
        <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '800' }}>
            {item.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>{item.userId?.name[0] || 'C'}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.customerName}>{item.userId?.name || 'Customer'}</Text>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>{item.serviceId?.name || 'Laundry'}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText}>{item.pickupAddress || item.deliveryAddress || 'N/A'}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Package size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Clock size={16} color="#F59E0B" />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>New Arrival</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <View>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, fontWeight: '600' }}>TOTAL</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.SUCCESS_TEXT }}>Rs {item.totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => handleClaim(item._id)}
        >
          <ExternalLink size={18} color={COLORS.WHITE} style={{ marginRight: 6 }} />
          <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>Claim Order</Text>
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
        <Text style={styles.sectionTitle}>Available Orders</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderAvailableOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Tag size={64} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No new orders available.</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default AvailableOrdersScreen;
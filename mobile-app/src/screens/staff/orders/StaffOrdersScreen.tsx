import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { MapPin, Navigation, Clock, Package, Tag, ExternalLink, ChevronRight, LayoutList, History, ArrowLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { staffOrderService, StaffOrder } from '../../../services/staff/staffOrderService';
import { notify } from '../../../utils/notify';

const StaffOrdersScreen = ({ forcedType }: { forcedType?: string }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = forcedType || params.type;
  const [activeTab, setActiveTab] = useState<'assigned' | 'available'>('assigned');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState<StaffOrder[]>([]);
  const [availableOrders, setAvailableOrders] = useState<StaffOrder[]>([]);

  const loadAllData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const activeStatuses = [
        'PICKUP_ASSIGNED', 'PICKUP_ON_THE_WAY', 'PICKUP_ARRIVED', 'PICKED_UP', 'HANDED_OVER',
        'READY', 'DELIVERY_ASSIGNED', 'DELIVERY_ON_THE_WAY', 'DELIVERY_ARRIVED'
      ];

      const [assigned, available] = await Promise.all([
        staffOrderService.getAssignedTasks(
          type === 'pickup' ? ['PICKUP_ASSIGNED', 'PICKUP_ON_THE_WAY', 'PICKUP_ARRIVED', 'PICKED_UP', 'HANDED_OVER'] :
            type === 'delivery' ? ['READY', 'DELIVERY_ASSIGNED', 'DELIVERY_ON_THE_WAY', 'DELIVERY_ARRIVED'] :
              type === 'history' ? ['DELIVERED'] : activeStatuses
        ),
        staffOrderService.getAvailableOrders()
      ]);

      setAssignedTasks(assigned);
      setAvailableOrders(available);

      if (!type) {
        if (assigned.length === 0 && available.length > 0) {
          setActiveTab('available');
        } else {
          setActiveTab('assigned');
        }
      } else if (type === 'available') {
        setActiveTab('available');
      } else {
        setActiveTab('assigned');
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
    }, [type])
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
      loadAllData();
    } catch (error: any) {
      notify.error('Claim Failed', error.message || 'Could not claim this order');
    }
  };

  const renderAssignedTask = ({ item }: { item: StaffOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>#{item.orderNo}</Text>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status.includes('ARRIVED') ? '#DCFCE7' :
                item.status.includes('THE_WAY') ? '#FEF3C7' :
                  item.status === 'PICKED_UP' ? '#F0F9FF' : '#F1F5F9'
          }
        ]}>
          <Text style={[
            styles.statusText,
            {
              color:
                item.status.includes('ARRIVED') ? '#16A34A' :
                  item.status.includes('THE_WAY') ? '#92400E' :
                    item.status === 'PICKED_UP' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY
            }
          ]}>{item.status.replace(/_/g, ' ')}</Text>
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
          style={[styles.secondaryAction, !(item.status.includes('ASSIGNED') || item.status.includes('THE_WAY')) && { flex: 1, alignItems: 'center' }]}
          onPress={() => router.push(`/(protected)/(staff)/orders/${item._id}`)}
        >
          <Text style={styles.secondaryActionText}>Details</Text>
        </TouchableOpacity>

        {(item.status.includes('ASSIGNED') || item.status.includes('THE_WAY')) && (
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => router.push({
              pathname: '/(protected)/(staff)/orders/tracking',
              params: { orderId: item._id }
            })}
          >
            <Navigation size={18} color={COLORS.WHITE} />
            <Text style={styles.primaryActionText}>Start Route</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderAvailableOrder = ({ item }: { item: StaffOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>#{item.orderNo}</Text>
        <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '800' }}>{item.status.replace(/_/g, ' ')}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userId?.name[0] || 'C'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
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

      <TouchableOpacity
        style={{ marginTop: 12, alignItems: 'center', padding: 8 }}
        onPress={() => router.push(`/(protected)/(staff)/orders/${item._id}`)}
      >
        <Text style={{ color: COLORS.PRIMARY, fontWeight: '600' }}>View Full Details</Text>
      </TouchableOpacity>
    </View>
  );

  const getTitle = () => {
    if (type === 'pickup') return 'Pickup Tasks';
    if (type === 'delivery') return 'Delivery Tasks';
    if (type === 'history') return 'Order History';
    return 'Order Management';
  };

  const header = (
    <View style={styles.header}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: !type ? 15 : 0
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {type ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginRight: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#F1F5F9'
              }}
            >
              <ArrowLeft size={20} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          ) : null}
          <Text style={[styles.sectionTitle, { marginHorizontal: 0, marginBottom: 0 }]}>
            {getTitle()}
          </Text>
        </View>

        {type !== 'history' && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(protected)/(staff)/orders', params: { type: 'history' } })}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: COLORS.PRIMARY_SOFT,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <History size={22} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        )}
      </View>

      {!type && (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRadius: 14,
              backgroundColor: activeTab === 'assigned' ? COLORS.PRIMARY : '#F1F5F9'
            }}
            onPress={() => setActiveTab('assigned')}
          >
            <Text style={{ color: activeTab === 'assigned' ? COLORS.WHITE : COLORS.TEXT_SECONDARY, fontWeight: '700' }}>My Tasks ({assignedTasks.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRadius: 14,
              backgroundColor: activeTab === 'available' ? COLORS.PRIMARY : '#F1F5F9'
            }}
            onPress={() => setActiveTab('available')}
          >
            <Text style={{ color: activeTab === 'available' ? COLORS.WHITE : COLORS.TEXT_SECONDARY, fontWeight: '700' }}>Available ({availableOrders.length})</Text>
          </TouchableOpacity>
        </View>
      )}
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
          data={activeTab === 'assigned' ? assignedTasks : availableOrders}
          renderItem={activeTab === 'assigned' ? renderAssignedTask : renderAvailableOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100, padding: 20 }}>
              <LayoutList size={80} color={COLORS.TEXT_SECONDARY} opacity={0.2} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16, textAlign: 'center' }}>
                No {type || 'assigned'} orders found at the moment.
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default StaffOrdersScreen;
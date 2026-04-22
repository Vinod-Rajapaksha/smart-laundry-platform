import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { PackageSearch, Clock, MapPin } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';

const FILTERS = ['All', 'Active', 'Completed', 'Cancelled'];

const OrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Cancelled') return order.status === 'CANCELLED';
    if (activeFilter === 'Completed') return order.status === 'DELIVERED';
    return !['DELIVERED', 'CANCELLED'].includes(order.status);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'CANCELLED': return { bg: '#FEF2F2', text: '#DC2626' };
      case 'IN_WASH': return { bg: '#EFF6FF', text: '#2563EB' };
      default: return { bg: '#FEF9C3', text: '#CA8A04' }; // PENDING, etc
    }
  };

  const renderItem = ({ item }: { item: Order }) => {
    const statusColors = getStatusColor(item.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order #{item.orderNo}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status.replace(/_/g, ' ')}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.detailText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.detailText} numberOfLines={1}>{item.pickupAddress || 'Self Service'}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>Rs.{item.totalAmount.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => router.push(`/(protected)/(customer)/orders/${item._id}`)}
          >
            <Text style={styles.trackButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Orders</Text>
      
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <View style={{ flex: 1 }}>
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PackageSearch size={64} color={COLORS.BORDER} />
          <Text style={styles.emptyTitle}>No Orders Found</Text>
          <Text style={styles.emptySubtitle}>You don't have any {activeFilter.toLowerCase()} orders at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
          }
        />
      )}
      </View>
    </ScreenWrapper>
  );
};

export default OrdersScreen;

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PackageSearch } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';
import OrderCard from '../../../components/customer/OrderCard';
import FeedbackModal from '../../../components/customer/FeedbackModal';
import { Feedback } from '../../../types/feedback.types';
import feedbackService from '../../../services/customer/feedbackService';

const FILTERS = ['Active', 'All', 'Completed', 'Cancelled'];

const OrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Active');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null);

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

  const handleReviewPress = (order: Order) => {
    setSelectedOrder(order);
    setExistingFeedback(null);
    setModalVisible(true);
  };

  const handleViewReviewPress = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const feedback = await feedbackService.getFeedbackForOrder(order._id);
      setExistingFeedback(feedback);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Cancelled') return order.status === 'CANCELLED';
    if (activeFilter === 'Completed') return order.status === 'DELIVERED';
    return !['DELIVERED', 'CANCELLED'].includes(order.status);
  });

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

  const handlePayPress = (order: Order) => {
    router.push({
      pathname: '/(protected)/(customer)/checkout/payment-method',
      params: { orderId: order._id, total: order.totalAmount }
    });
  };

  const handleCancelPress = (order: Order) => {
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${order.orderNo}?`,
      [
        { text: 'No, Keep it', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await orderService.cancelOrder(order._id);
              Alert.alert('Success', 'Order cancelled successfully');
              fetchOrders();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel order');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

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
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                onPress={() => router.push(`/(protected)/(customer)/orders/${item._id}`)}
                onReviewPress={handleReviewPress}
                onViewReviewPress={handleViewReviewPress}
                onPayPress={handlePayPress}
                onCancelPress={handleCancelPress}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
            }
          />
        )}
      </View>

      <FeedbackModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
        existingFeedback={existingFeedback}
        onSubmitSuccess={fetchOrders}
      />
    </ScreenWrapper>
  );
};

export default OrdersScreen;

import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Calendar, Package } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen displaying the history of all completed and cancelled orders.
 * Includes status-based filtering and premium card-based layout.
 */
const OrderHistoryScreen = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Completed', 'Cancelled', 'Refunded'];

  const [history] = useState([
    {
      id: 'ORD-9876',
      date: '24 May 2024',
      items: 8,
      total: 1250.00,
      status: 'Completed',
      serviceType: 'Wash & Fold'
    },
    {
      id: 'ORD-9840',
      date: '15 May 2024',
      items: 12,
      total: 2100.00,
      status: 'Cancelled',
      serviceType: 'Dry Cleaning'
    },
    {
      id: 'ORD-9710',
      date: '02 May 2024',
      items: 5,
      total: 850.00,
      status: 'Completed',
      serviceType: 'Express Wash'
    }
  ]);

  const filteredHistory = activeFilter === 'All' 
    ? history 
    : history.filter(order => order.status === activeFilter);

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => router.push({
        pathname: '/(protected)/(customer)/orders/[orderId]',
        params: { orderId: item.id }
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'Completed' ? '#F0FDF4' : '#FEF2F2' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: item.status === 'Completed' ? '#16A34A' : '#DC2626' }
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Calendar size={16} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.detailText}>{item.date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Package size={16} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.detailText}>{item.items} Items • {item.serviceType}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.priceText}>LKR {item.total.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => router.push('/(protected)/(customer)/vouchers/index')}
        >
          <Text style={styles.trackButtonText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Order History</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={64} color={COLORS.TEXT_SECONDARY} opacity={0.2} />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters to see more orders.</Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default OrderHistoryScreen;

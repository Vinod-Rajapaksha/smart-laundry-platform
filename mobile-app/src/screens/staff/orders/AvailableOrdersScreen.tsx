import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Package, Clock, Tag } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Screen for Staff to browse and claim new orders available for pickup.
 * Features a high-visibility queue with location and payout info.
 */
const AvailableOrdersScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [availableOrders] = useState([
    {
      id: 'ORD-2022',
      customer: 'Sarah Jenkins',
      address: 'No. 45, Flower Road, Colombo 03',
      distance: '1.2 km',
      items: 6,
      payout: 450.00,
      dueTime: 'Within 30 mins'
    },
    {
      id: 'ORD-2025',
      customer: 'Mark Anthony',
      address: 'Lotus Tower Apts, Colombo 01',
      distance: '2.5 km',
      items: 15,
      payout: 850.00,
      dueTime: 'Within 1 hour'
    }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderAvailableOrder = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.id}</Text>
        <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '800' }}>NEW</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>{item.customer[0]}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.customerName}>{item.customer}</Text>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>{item.distance} away</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText}>{item.address}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Package size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>{item.items} Items</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Clock size={16} color="#F59E0B" />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>{item.dueTime}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <View>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, fontWeight: '600' }}>PAYOUT</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.SUCCESS_TEXT }}>LKR {item.payout.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => { }}
        >
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
      <FlatList
        data={availableOrders}
        renderItem={renderAvailableOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Tag size={64} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No new orders available.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default AvailableOrdersScreen;
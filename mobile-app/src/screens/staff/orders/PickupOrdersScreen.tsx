import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Truck, Package } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const PickupOrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([
    {
      _id: '3',
      orderNo: 'ORD-5530',
      status: 'READY_FOR_PICKUP',
      customerName: 'Samith Perera',
      address: 'No 12, Park Road, Nugegoda',
      items: 'Laundry Bag x1'
    }
  ]);

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: '#D97706', fontSize: 12, fontWeight: '700' }}>PICKUP</Text>
        </View>
      </View>

      <Text style={[styles.customerName, { marginLeft: 0, marginBottom: 12 }]}>{item.customerName}</Text>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText}>{item.address}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Package size={18} color={COLORS.TEXT_SECONDARY} />
        <Text style={[styles.addressText, { fontWeight: '600' }]}>{item.items}</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryAction, { marginLeft: 0 }]}
        onPress={() => router.push({
          pathname: '/(protected)/(staff)/scan/scanner',
          params: { mode: 'PICKUP', orderId: item._id }
        })}
      >
        <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>Scan to Pickup</Text>
      </TouchableOpacity>
    </View>
  );

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Pending Pickups</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Truck size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No pending pickups.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default PickupOrdersScreen;
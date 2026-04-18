import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Truck, CheckCircle2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const DeliveryOrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([
    {
      _id: '4',
      orderNo: 'ORD-5541',
      status: 'OUT_FOR_DELIVERY',
      customerName: 'Amani Wijesinghe',
      address: 'Floor 5, Access Towers, Colombo 02',
      items: 'Cleaned Laundry x1'
    }
  ]);

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <View style={{ backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: '#059669', fontSize: 12, fontWeight: '700' }}>DELIVERY</Text>
        </View>
      </View>

      <Text style={[styles.customerName, { marginLeft: 0, marginBottom: 12 }]}>{item.customerName}</Text>

      <View style={styles.addressRow}>
        <MapPin size={18} color="#059669" />
        <Text style={styles.addressText}>{item.address}</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryAction, { marginLeft: 0, backgroundColor: '#059669' }]}
        onPress={() => router.push({
          pathname: '/(protected)/(staff)/scan/scanner',
          params: { mode: 'DELIVERY', orderId: item._id }
        })}
      >
        <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>Confirm Delivery</Text>
      </TouchableOpacity>
    </View>
  );

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Deliveries</Text>
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
            <CheckCircle2 size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No pending deliveries.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default DeliveryOrdersScreen;

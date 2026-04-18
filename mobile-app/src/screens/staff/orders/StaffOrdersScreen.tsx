import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Navigation, Package, CheckCircle, RefreshCcw } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Screen for Staff to manage their assigned and claimed orders.
 * Shows personal queue with status tracking and action buttons.
 */
const StaffOrdersScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ACTIVE');

  const [myOrders] = useState([
    {
      id: 'ORD-1234',
      customer: 'John Doe',
      address: 'No. 123, Ward Place, Colombo 07',
      status: 'PICKUP_READY',
      items: 10,
      total: 1650.00
    },
    {
      id: 'ORD-1190',
      customer: 'Alice Silver',
      address: 'Skyline Residencies, Colombo 04',
      status: 'WASHING',
      items: 4,
      total: 900.00
    }
  ]);

  const renderMyOrder = ({ item }: any) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push({
        pathname: '/(protected)/(staff)/orders/details',
        params: { orderId: item.id }
      })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.id}</Text>
        <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: COLORS.SUCCESS_TEXT, fontSize: 12, fontWeight: '800' }}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', color: COLORS.PRIMARY }}>{item.customer[0]}</Text>
        </View>
        <Text style={styles.customerName}>{item.customer}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Package size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>{item.items} Items</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <RefreshCcw size={16} color={COLORS.PRIMARY} />
          <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY }}>Update Status</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryAction}>
          <Navigation size={18} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push('/(protected)/(staff)/scan/manual')}
        >
          <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>View QR Code</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>My Orders</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <View style={{ flexDirection: 'row', padding: 20, gap: 10 }}>
        {['ACTIVE', 'COMPLETED'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? COLORS.PRIMARY : COLORS.WHITE,
              borderWidth: 1,
              borderColor: activeTab === tab ? COLORS.PRIMARY : '#E2E8F0'
            }}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ fontWeight: '700', color: activeTab === tab ? COLORS.WHITE : COLORS.TEXT_SECONDARY }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={myOrders}
        renderItem={renderMyOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <CheckCircle size={64} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No active tasks.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default StaffOrdersScreen;
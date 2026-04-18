import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Phone, MessageSquare, Package, User } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const AssignedOrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([
    {
      _id: '1',
      orderNo: 'ORD-5521',
      status: 'ASSIGNED',
      customerName: 'Vinod Rajapaksha',
      address: '123/A, High Level Road, Maharagama',
      phone: '0771234567',
      items: 5,
      totalPrice: 1500.00
    },
    {
      _id: '2',
      orderNo: 'ORD-5524',
      status: 'ASSIGNED',
      customerName: 'Kishan Perera',
      address: '45, Galle Road, Colombo 03',
      phone: '0719876543',
      items: 3,
      totalPrice: 850.00
    }
  ]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <View style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: COLORS.PRIMARY, fontSize: 12, fontWeight: '700' }}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} color={COLORS.TEXT_SECONDARY} />
        </View>
        <Text style={styles.customerName}>{item.customerName}</Text>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={18} color={COLORS.PRIMARY} />
        <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryAction} onPress={() => handleCall(item.phone)}>
          <Phone size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction} onPress={() => { }}>
          <MessageSquare size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push({
            pathname: '/(protected)/(staff)/orders/details',
            params: { id: item._id }
          })}
        >
          <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Assigned Jobs</Text>
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
            <Package size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No assignments found.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default AssignedOrdersScreen;

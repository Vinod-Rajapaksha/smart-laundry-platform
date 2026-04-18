import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const HistoryScreen = () => {
  const router = useRouter();
  const [history, setHistory] = useState([
    {
      _id: '5',
      orderNo: 'ORD-5501',
      status: 'DELIVERED',
      customerName: 'Kamal Silva',
      date: '23 May 2024',
      earning: 150.00
    },
    {
      _id: '6',
      orderNo: 'ORD-5498',
      status: 'DELIVERED',
      customerName: 'Dilini Perera',
      date: '22 May 2024',
      earning: 120.00
    }
  ]);

  const renderHistoryItem = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <Text style={{ color: COLORS.TEXT_SECONDARY, fontSize: 13 }}>{item.date}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={[styles.customerName, { marginLeft: 0 }]}>{item.customerName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <CheckCircle size={14} color="#16A34A" />
            <Text style={{ color: '#16A34A', fontSize: 13, fontWeight: '600', marginLeft: 4 }}>Delivered</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>Earning</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>LKR {item.earning.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Job History</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Clock size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No history records yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default HistoryScreen;

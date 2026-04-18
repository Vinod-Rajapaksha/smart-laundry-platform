import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, Calendar } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const EarningsScreen = () => {
  const router = useRouter();

  const history = [
    { id: '1', date: '23 May 2024', orders: 12, amount: 1850.00 },
    { id: '2', date: '22 May 2024', orders: 8, amount: 1200.00 },
    { id: '3', date: '21 May 2024', orders: 15, amount: 2250.00 },
  ];

  const renderHistory = ({ item }: any) => (
    <View style={[styles.orderCard, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={20} color={COLORS.PRIMARY} />
        </View>
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>{item.date}</Text>
          <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>{item.orders} Jobs completed</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#16A34A' }}>+LKR {item.amount.toFixed(2)}</Text>
    </View>
  );

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Total Earnings</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={[styles.balanceCard, { backgroundColor: '#0F172A', marginHorizontal: 20, marginTop: 20 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
            <Text style={styles.balanceValue}>LKR 12,450.00</Text>
          </View>
          <Wallet size={40} color="rgba(255,255,255,0.4)" />
        </View>
        <TouchableOpacity style={{ backgroundColor: COLORS.WHITE, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 16 }}>Cash Out Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { marginHorizontal: 20, marginTop: 30 }]}>Earning History</Text>

      <View style={{ paddingHorizontal: 20 }}>
        <FlatList
          data={history}
          renderItem={renderHistory}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EarningsScreen;

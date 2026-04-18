import { useState } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Truck, CheckCircle, Clock, Bell, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const StaffHomeScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    assigned: 5,
    pickups: 3,
    deliveries: 2,
    completed: 12
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch real stats here
    setTimeout(() => setRefreshing(false), 1500);
  };

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <View>
        <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>Good Morning,</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Staff Member</Text>
      </View>
      <TouchableOpacity
        style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
        onPress={() => router.push('/(protected)/(staff)/notifications/list')}
      >
        <Bell size={24} color={COLORS.TEXT_PRIMARY} />
        <View style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', borderWidth: 2, borderColor: COLORS.WHITE }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[COLORS.PRIMARY]} 
          tintColor={COLORS.PRIMARY} 
        />
      }
    >
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Today's Overview</Text>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => router.push('/(protected)/(staff)/orders/assigned')}
        >
          <Package size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{stats.assigned}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={() => router.push('/(protected)/(staff)/orders/pickup')}
        >
          <Clock size={28} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.pickups}</Text>
          <Text style={styles.statLabel}>Pending Pickups</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={() => router.push('/(protected)/(staff)/orders/delivery')}
        >
          <Truck size={28} color="#8B5CF6" />
          <Text style={styles.statValue}>{stats.deliveries}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={() => router.push('/(protected)/(staff)/orders/history')}
        >
          <CheckCircle size={28} color="#10B981" />
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.orderCard, { flexDirection: 'row', alignItems: 'center', paddingVertical: 24, marginTop: 10 }]}
        onPress={() => router.push('/(protected)/(staff)/scan/scanner')}
      >
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={30} color={COLORS.PRIMARY} />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Scan QR Code</Text>
          <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 2 }}>Instantly process customer orders</Text>
        </View>
        <ChevronRight size={24} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
}
;

export default StaffHomeScreen;

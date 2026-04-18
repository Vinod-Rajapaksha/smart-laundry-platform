import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Package, Truck, CheckCircle, Clock,
  Bell, ChevronRight, QrCode, ClipboardList
} from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { staffService, StaffStats } from '../../../services/staff/staffService';
import { notify } from '../../../utils/notify';
import { useAppSelector } from '../../../store/hooks';

const StaffHomeScreen = () => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StaffStats>({
    pickups: 0,
    processing: 0,
    deliveries: 0,
    completedToday: 0
  });

  const fetchStats = async () => {
    try {
      const data = await staffService.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      notify.error('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const header = (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userNameText}>{user?.name || 'Staff Member'}</Text>
      </View>
      <TouchableOpacity
        style={styles.notifButton}
        onPress={() => router.push('/(protected)/(staff)/notifications/list')}
      >
        <Bell size={24} color={COLORS.TEXT_PRIMARY} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

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
      <View style={styles.mainContent}>
        <Text style={styles.sectionTitle}>Operations Overview</Text>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statBox, { borderLeftColor: '#F59E0B', borderLeftWidth: 4 }]}
            onPress={() => router.push('/(protected)/(staff)/orders/pickup')}
          >
            <Clock size={28} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.pickups}</Text>
            <Text style={styles.statLabel}>Pending Pickups</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4 }]}
            onPress={() => router.push('/(protected)/(staff)/orders/pending')}
          >
            <Package size={28} color={COLORS.PRIMARY} />
            <Text style={styles.statValue}>{stats.processing}</Text>
            <Text style={styles.statLabel}>In Treatment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { borderLeftColor: '#8B5CF6', borderLeftWidth: 4 }]}
            onPress={() => router.push('/(protected)/(staff)/orders/delivery')}
          >
            <Truck size={28} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.deliveries}</Text>
            <Text style={styles.statLabel}>Out for Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { borderLeftColor: '#10B981', borderLeftWidth: 4 }]}
            onPress={() => router.push('/(protected)/(staff)/orders/history')}
          >
            <CheckCircle size={28} color="#10B981" />
            <Text style={styles.statValue}>{stats.completedToday}</Text>
            <Text style={styles.statLabel}>Success Today</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(protected)/(staff)/scan')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
            <QrCode size={26} color={COLORS.PRIMARY} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Scan Service QR</Text>
            <Text style={styles.actionSubtitle}>Pick up or deliver an order instantly</Text>
          </View>
          <ChevronRight size={20} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(protected)/(staff)/orders')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FDF2F8' }]}>
            <ClipboardList size={26} color="#DB2777" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Order Management</Text>
            <Text style={styles.actionSubtitle}>View and manage all active cycles</Text>
          </View>
          <ChevronRight size={20} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

export default StaffHomeScreen;

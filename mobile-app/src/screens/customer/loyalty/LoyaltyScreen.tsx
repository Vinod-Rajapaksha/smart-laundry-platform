import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, TrendingUp, Gift, Zap, ChevronRight, Clock } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../wallet/styles/Wallet.styles';
import { loyaltyService, LoyaltyStatus, LoyaltyTransaction } from '../../../services/customer/loyaltyService';

const LoyaltyScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [history, setHistory] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statusData, historyData] = await Promise.all([
        loyaltyService.getStatus(),
        loyaltyService.getHistory()
      ]);
      setStatus(statusData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const progress = status ? (status.points / (status.tierId?.minPoints + 500)) * 100 : 0;

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Loyalty Program</Text>
    </View>
  );

  if (loading) {
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
    >
      {/* Points Card */}
      <View style={[styles.balanceCard, { backgroundColor: '#1E293B', marginHorizontal: 20, marginBottom: 20 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.balanceLabel}>Your Points</Text>
            <Text style={styles.balanceValue}>{status?.points || 0}</Text>
          </View>
          <Star size={40} color="#F59E0B" fill="#F59E0B" />
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: '#F59E0B' }]} />
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 12 }}>
          Keep using our services to earn more points!
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statGrid, { paddingHorizontal: 20 }]}>
        <View style={styles.statCard}>
          <TrendingUp size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{status?.tierId?.name || 'Bronze'}</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>

        <View style={styles.statCard}>
          <Zap size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{status?.tierId?.discountPercent || 0}%</Text>
          <Text style={styles.statLabel}>Auto Discount</Text>
        </View>

        <View style={styles.statCard}>
          <Gift size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{history.filter(h => h.type === 'REDEEMED').length}</Text>
          <Text style={styles.statLabel}>Rewards Used</Text>
        </View>

        <View style={styles.statCard}>
          <Star size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{status?.totalSpent || 0}</Text>
          <Text style={styles.statLabel}>Total LKR Spent</Text>
        </View>
      </View>

      {/* Redemptions Link */}
      <TouchableOpacity
        style={[styles.transactionItem, { marginTop: 20, paddingVertical: 20, marginHorizontal: 20 }]}
        onPress={() => router.push('/(protected)/(customer)/vouchers/available')}
      >
        <Gift size={24} color={COLORS.PRIMARY} />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>Redeem for Vouchers</Text>
          <Text style={styles.transactionDate}>Use your points to get discounts</Text>
        </View>
        <ChevronRight size={20} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>

      {/* Point History */}
      <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 30 }]}>Point History</Text>
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {history.length > 0 ? (
          history.map((item) => (
            <View key={item._id} style={styles.transactionItem}>
              <View style={[styles.iconBox, { backgroundColor: item.points > 0 ? '#F0FDF4' : '#FFF1F2' }]}>
                {item.points > 0 ? <TrendingUp size={20} color="#22C55E" /> : <Clock size={20} color="#E11D48" />}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.description || item.type}</Text>
                <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.points > 0 ? '#16A34A' : '#E11D48' }]}>
                {item.points > 0 ? '+' : ''}{item.points}
              </Text>
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Clock size={48} color={COLORS.TEXT_MUTED} />
            <Text style={{ marginTop: 10, color: COLORS.TEXT_SECONDARY }}>No point history found</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default LoyaltyScreen;

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Star, TrendingUp, Gift, Zap,
  ChevronRight, Clock, Info, ShieldCheck,
  CircleCheck, Medal, Sparkles
} from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { loyaltyService, LoyaltyStatus, LoyaltyTransaction } from '../../../services/customer/loyaltyService';
import { notify } from '../../../utils/notify';

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
      notify.error('Error', 'Failed to sync your reward points');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tier = status?.tierId?.name || 'Bronze';
  const points = status?.points || 0;

  // Calculate next tier progress (assuming 500 point intervals if not specific)
  const nextTierPoints = (status?.tierId?.minPoints || 0) + 500;
  const progress = Math.min((points / nextTierPoints) * 100, 100);

  const header = (
    <View style={lStyles.header}>
      <TouchableOpacity onPress={() => router.back()} style={lStyles.backButton}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={lStyles.headerTitle}>Loyalty & Rewards</Text>
      <TouchableOpacity onPress={fetchData}>
        <Clock size={20} color={COLORS.PRIMARY} />
      </TouchableOpacity>
    </View>
  );

  const getTierDetails = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('PLATINUM')) return { color: '#1E293B', bg: '#F1F5F9', icon: <Medal size={24} color="#1E293B" /> };
    if (n.includes('GOLD')) return { color: '#D97706', bg: '#FEF3C7', icon: <Medal size={24} color="#D97706" /> };
    if (n.includes('SILVER')) return { color: '#475569', bg: '#F8FAFC', icon: <Medal size={24} color="#475569" /> };
    return { color: '#92400E', bg: '#FFedd5', icon: <Sparkles size={24} color="#92400E" /> };
  };

  const tierMeta = getTierDetails(tier);

  if (loading) {
    return (
      <View style={lStyles.loader}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={lStyles.loaderText}>Syncing your rewards...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper
      header={header}
      style={{ backgroundColor: '#F8FAFC' }}
      scroll
    >
      <View style={lStyles.container}>

        {/* Main Reward Card */}
        <View style={[lStyles.pointsCard, { backgroundColor: tierMeta.color }]}>
          <View style={lStyles.cardTop}>
            <View>
              <Text style={lStyles.pointsLabel}>Available Balance</Text>
              <View style={lStyles.pointsRow}>
                <Text style={lStyles.pointsValue}>{points}</Text>
                <Text style={lStyles.pointsUnit}>Points</Text>
              </View>
            </View>
            <View style={lStyles.tierBadge}>
              <Medal size={16} color={tierMeta.color} />
              <Text style={[lStyles.tierText, { color: tierMeta.color }]}>{tier}</Text>
            </View>
          </View>

          <View style={lStyles.progressSection}>
            <View style={lStyles.progressContainer}>
              <View style={[lStyles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={lStyles.progressInfo}>
              {points >= nextTierPoints ? 'You reached the max tier!' : `${nextTierPoints - points} points to reach next level`}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={lStyles.statsGrid}>
          <View style={lStyles.statBox}>
            <Zap size={20} color={COLORS.PRIMARY} />
            <Text style={lStyles.statVal}>{status?.tierId?.discountPercent || 0}%</Text>
            <Text style={lStyles.statLab}>Tier Discount</Text>
          </View>
          <View style={lStyles.statBox}>
            <ShieldCheck size={20} color={COLORS.SUCCESS} />
            <Text style={lStyles.statVal}>Active</Text>
            <Text style={lStyles.statLab}>Status</Text>
          </View>
          <View style={lStyles.statBox}>
            <Star size={20} color="#F59E0B" />
            <Text style={lStyles.statVal}>{status?.totalSpent || 0}</Text>
            <Text style={lStyles.statLab}>Total Spent</Text>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={lStyles.sectionHeader}>
          <Text style={lStyles.sectionTitle}>Your {tier} Benefits</Text>
          <TouchableOpacity onPress={() => router.push('/(protected)/(customer)/loyalty/membership')}>
            <Text style={lStyles.viewAll}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        <View style={lStyles.benefitsCard}>
          <View style={lStyles.benefitItem}>
            <CircleCheck size={18} color={COLORS.SUCCESS} />
            <Text style={lStyles.benefitText}>{status?.tierId?.discountPercent || 0}% automatic discount on every order</Text>
          </View>
          {status?.tierId?.perks?.map((perk, i) => (
            <View key={i} style={lStyles.benefitItem}>
              <CircleCheck size={18} color={COLORS.SUCCESS} />
              <Text style={lStyles.benefitText}>{perk}</Text>
            </View>
          ))}
          {tier === 'Bronze' && (
            <TouchableOpacity
              style={lStyles.voucherLink}
            >
              <Gift size={18} color={COLORS.PRIMARY} />
              <Text style={lStyles.voucherLinkText}>You can use Vouchers!</Text>
              <ChevronRight size={16} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          )}
        </View>

        {/* History Section */}
        <View style={lStyles.sectionHeader}>
          <Text style={lStyles.sectionTitle}>Earnings History</Text>
        </View>

        <View style={lStyles.historyList}>
          {history.length > 0 ? (
            history.map((item) => (
              <View key={item._id} style={lStyles.historyItem}>
                <View style={[lStyles.historyIcon, { backgroundColor: item.points > 0 ? '#F0FDF4' : '#FFF1F2' }]}>
                  {item.points > 0 ? <TrendingUp size={20} color="#22C55E" /> : <Gift size={20} color="#E11D48" />}
                </View>
                <View style={lStyles.historyInfo}>
                  <Text style={lStyles.historyTitle}>{item.description || item.type}</Text>
                  <Text style={lStyles.historyDate}>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                </View>
                <Text style={[lStyles.historyAmount, { color: item.points > 0 ? '#16A34A' : '#E11D48' }]}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </Text>
              </View>
            ))
          ) : (
            <View style={lStyles.emptyState}>
              <Info size={40} color={COLORS.TEXT_MUTED} />
              <Text style={lStyles.emptyText}>Start your laundry journey to earn points!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

const lStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.WHITE,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  backButton: {
    padding: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    gap: 12,
  },
  loaderText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    padding: 20,
  },
  pointsCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 24,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  pointsLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  pointsValue: {
    color: COLORS.WHITE,
    fontSize: 36,
    fontWeight: '800',
  },
  pointsUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  tierBadge: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressSection: {
    gap: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 3,
  },
  progressInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
  },
  statLab: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  benefitsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  voucherLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    gap: 10,
  },
  voucherLinkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  historyList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    fontSize: 13,
  },
});

export default LoyaltyScreen;

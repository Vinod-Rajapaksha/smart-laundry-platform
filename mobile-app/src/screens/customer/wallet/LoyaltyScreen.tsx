import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, TrendingUp, Gift, Zap, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Wallet.styles';

const LoyaltyScreen = () => {
  const router = useRouter();
  const [points, setPoints] = useState(450);
  const [tier, setTier] = useState('Silver');
  const [nextTierPoints, setNextTierPoints] = useState(1000);

  const progress = (points / nextTierPoints) * 100;

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Loyalty Program</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={[styles.balanceCard, { backgroundColor: '#1E293B', marginHorizontal: 20 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.balanceLabel}>Your Points</Text>
            <Text style={styles.balanceValue}>{points}</Text>
          </View>
          <Star size={40} color="#F59E0B" fill="#F59E0B" />
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#F59E0B' }]} />
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 12 }}>
          {nextTierPoints - points} points until Gold Tier
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Stats Overview</Text>

      <View style={[styles.statGrid, { paddingHorizontal: 20 }]}>
        <View style={styles.statCard}>
          <TrendingUp size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>{tier}</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>

        <View style={styles.statCard}>
          <Gift size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Rewards Used</Text>
        </View>

        <View style={styles.statCard}>
          <Zap size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>2.5x</Text>
          <Text style={styles.statLabel}>Points Multiplier</Text>
        </View>

        <View style={styles.statCard}>
          <Star size={28} color={COLORS.PRIMARY} />
          <Text style={styles.statValue}>450</Text>
          <Text style={styles.statLabel}>Lifetime Points</Text>
        </View>
      </View>

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
      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};

export default LoyaltyScreen;

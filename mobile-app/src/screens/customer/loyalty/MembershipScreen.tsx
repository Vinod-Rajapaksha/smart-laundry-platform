import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../wallet/styles/Wallet.styles';
import { loyaltyService, LoyaltyStatus, LoyaltyTier } from '../../../services/customer/loyaltyService';

const MembershipScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statusData, tiersData] = await Promise.all([
        loyaltyService.getStatus(),
        loyaltyService.getTiers()
      ]);
      setStatus(statusData);
      setTiers(tiersData);
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Membership</Text>
    </View>
  );

  const getTierIcon = (name: string, color: string) => {
    if (name.toUpperCase().includes('PLATINUM') || name.toUpperCase().includes('GOLD')) {
      return <Crown size={32} color={color} />;
    }
    return <Zap size={32} color={color} />;
  };

  const getTierColor = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('PLATINUM')) return '#1E293B';
    if (n.includes('GOLD')) return '#F59E0B';
    if (n.includes('SILVER')) return '#94A3B8';
    return COLORS.PRIMARY;
  };

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
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={{ backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: COLORS.PRIMARY }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>Your Current Status</Text>
          <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 4 }}>
            You are currently on the <Text style={{ fontWeight: '700', color: COLORS.PRIMARY }}>{status?.tierId?.name || 'Bronze'}</Text> tier. 
            Earn more points to unlock premium benefits!
          </Text>
        </View>

        {tiers.map((tier) => {
          const isCurrent = status?.tierId?._id === tier._id;
          const color = getTierColor(tier.name);
          
          return (
            <View
              key={tier._id}
              style={[
                { backgroundColor: COLORS.WHITE, borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: '#F1F5F9' },
                isCurrent && { borderColor: COLORS.PRIMARY, shadowColor: COLORS.PRIMARY, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 }
              ]}
            >
              {isCurrent && (
                <View style={{ position: 'absolute', top: -12, right: 24, backgroundColor: COLORS.PRIMARY, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: COLORS.WHITE, fontSize: 10, fontWeight: '800' }}>CURRENT PLAN</Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.TEXT_SECONDARY }}>{tier.name} Tier</Text>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY, marginTop: 4 }}>
                    {tier.minPoints === 0 ? 'Welcome' : `${tier.minPoints} Points`}
                  </Text>
                </View>
                {getTierIcon(tier.name, color)}
              </View>

              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Check size={16} color="#16A34A" />
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>{tier.discountPercent}% Auto Discount on all orders</Text>
                </View>
                {tier.perks.map((perk, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Check size={16} color="#16A34A" />
                    </View>
                    <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>{perk}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: color },
                  isCurrent && { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
                ]}
                disabled={isCurrent}
                onPress={() => router.push('/(protected)/(customer)/loyalty')}
              >
                <Text style={[
                  { fontSize: 16, fontWeight: '700', color: color },
                  isCurrent && { color: COLORS.TEXT_SECONDARY },
                ]}>
                  {isCurrent ? 'Current Plan' : 'Learn How to Earn'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScreenWrapper>
  );
};

export default MembershipScreen;

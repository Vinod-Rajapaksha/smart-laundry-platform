import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Wallet.styles';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    features: ['Standard delivery', '1x Points', 'Email support'],
    current: true,
    color: '#94A3B8'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'LKR 2,500/mo',
    features: ['Express delivery', '2x Points', 'Priority support', 'Free fabric softener'],
    current: false,
    color: COLORS.PRIMARY,
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 'LKR 5,000/mo',
    features: ['Ultra-fast (12h) delivery', '3x Points', 'Dedicated agent', 'Monthly subscription gift'],
    current: false,
    color: '#1E293B'
  }
];

const MembershipScreen = () => {
  const router = useRouter();

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Membership</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, marginBottom: 24 }}>
          Upgrade your membership to unlock exclusive benefits and faster services.
        </Text>

        {PLANS.map((plan) => (
          <View
            key={plan.id}
            style={[
              { backgroundColor: COLORS.WHITE, borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: '#F1F5F9' },
              plan.popular && { borderColor: COLORS.PRIMARY, shadowColor: COLORS.PRIMARY, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 }
            ]}
          >
            {plan.popular && (
              <View style={{ position: 'absolute', top: -12, right: 24, backgroundColor: COLORS.PRIMARY, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 }}>
                <Text style={{ color: COLORS.WHITE, fontSize: 12, fontWeight: '800' }}>MOST POPULAR</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.TEXT_SECONDARY }}>{plan.name}</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY, marginTop: 4 }}>{plan.price}</Text>
              </View>
              {plan.id === 'elite' ? <Crown size={32} color={plan.color} /> : <Zap size={32} color={plan.color} />}
            </View>

            <View style={{ marginBottom: 24 }}>
              {plan.features.map((feature, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Check size={16} color="#16A34A" />
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.PRIMARY },
                plan.current && { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
                plan.popular && { backgroundColor: COLORS.PRIMARY }
              ]}
              disabled={plan.current}
            >
              <Text style={[
                { fontSize: 16, fontWeight: '700', color: COLORS.PRIMARY },
                plan.current && { color: COLORS.TEXT_SECONDARY },
                plan.popular && { color: COLORS.WHITE }
              ]}>
                {plan.current ? 'Current Plan' : 'Select Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

export default MembershipScreen;

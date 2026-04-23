import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShoppingBag, Home, List, ArrowRight, ShieldCheck } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';

/**
 * Success screen shown after a Staff member successfully delivers an order.
 * Displays summary and providing easy navigation back to tasks.
 */
const DeliveryConfirmationScreen = () => {
  const router = useRouter();
  const { orderId, customerName, totalAmount } = useLocalSearchParams();

  return (
    <ScreenWrapper scroll style={{ backgroundColor: '#F8FAFC' }}>
      <View style={confStyles.content}>
        <View style={confStyles.successIconBox}>
          <ShieldCheck size={80} color="#16A34A" strokeWidth={1.5} />
        </View>

        <Text style={confStyles.title}>Order Delivered!</Text>
        <Text style={confStyles.subtitle}>
          Order <Text style={{ fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>#{orderId}</Text> has been successfully delivered to the customer.
        </Text>

        <View style={confStyles.summaryCard}>
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Customer</Text>
            <Text style={confStyles.value}>{customerName || 'Standard Customer'}</Text>
          </View>
          <View style={confStyles.divider} />
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Verification</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} color="#16A34A" />
              <Text style={[confStyles.value, { color: '#16A34A' }]}>QR VERIFIED</Text>
            </View>
          </View>
          <View style={confStyles.divider} />
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Total Value</Text>
            <Text style={confStyles.value}>Rs {parseInt(totalAmount as string || '0').toLocaleString()}</Text>
          </View>
        </View>

        <View style={confStyles.actions}>
          <TouchableOpacity
            style={confStyles.primaryBtn}
            onPress={() => router.replace('/(protected)/(staff)/home')}
          >
            <Home size={20} color={COLORS.WHITE} />
            <Text style={confStyles.primaryBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={confStyles.secondaryBtn}
            onPress={() => router.replace('/(protected)/(staff)/home')}
          >
            <List size={20} color={COLORS.PRIMARY} />
            <Text style={confStyles.secondaryBtnText}>View Remaining Tasks</Text>
            <ArrowRight size={18} color={COLORS.PRIMARY} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>

        <View style={confStyles.footer}>
          <Text style={confStyles.footerText}>
            The customer's transaction is now marked as complete.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const confStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '800',
    flex: 0.7,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: COLORS.WHITE,
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
  },
  secondaryBtnText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '600',
  }
});

export default DeliveryConfirmationScreen;

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Home, List, ArrowRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';

/**
 * Success screen shown after a Staff member successfully picks up an order.
 * Displays summary and provides easy navigation back to tasks.
 */
const PickupConfirmationScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <ScreenWrapper scroll>
      <View style={confStyles.content}>
        <View style={confStyles.successIconBox}>
          <CheckCircle2 size={80} color={COLORS.SUCCESS} strokeWidth={1.5} />
        </View>

        <Text style={confStyles.title}>Pickup Successful!</Text>
        <Text style={confStyles.subtitle}>
          Order <Text style={{ fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>{orderId || 'ORD-8890'}</Text> has been successfully claimed and is ready for processing.
        </Text>

        <View style={confStyles.summaryCard}>
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Customer</Text>
            <Text style={confStyles.value}>John Doe</Text>
          </View>
          <View style={confStyles.divider} />
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Items Collected</Text>
            <Text style={confStyles.value}>12 Items</Text>
          </View>
          <View style={confStyles.divider} />
          <View style={confStyles.row}>
            <Text style={confStyles.label}>Location</Text>
            <Text style={confStyles.value} numberOfLines={1}>Ward Place, Colombo 07</Text>
          </View>
        </View>

        <View style={confStyles.actions}>
          <TouchableOpacity
            style={confStyles.primaryBtn}
            onPress={() => router.push('/(protected)/(staff)/home')}
          >
            <Home size={20} color={COLORS.WHITE} />
            <Text style={confStyles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={confStyles.secondaryBtn}
            onPress={() => router.push('/(protected)/(staff)/orders/my-orders')}
          >
            <List size={20} color={COLORS.PRIMARY} />
            <Text style={confStyles.secondaryBtnText}>View My Tasks</Text>
            <ArrowRight size={18} color={COLORS.PRIMARY} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>

        <View style={confStyles.footer}>
          <Text style={confStyles.footerText}>
            The customer has been notified of the successful pickup.
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
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: COLORS.SUCCESS,
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

export default PickupConfirmationScreen;

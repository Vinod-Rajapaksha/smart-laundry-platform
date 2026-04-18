import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';

/**
 * Error screen shown when an invalid or expired QR code is scanned.
 * Provides clear reasons and guidance on how to proceed.
 */
const InvalidQrScreen = () => {
  const router = useRouter();

  return (
    <ScreenWrapper scroll style={{ backgroundColor: '#FFF1F2' }} statusBarColor="#FFF1F2">
      <View style={errStyles.content}>
        <View style={errStyles.errorIconBox}>
          <AlertTriangle size={80} color="#EF4444" strokeWidth={1.5} />
        </View>

        <Text style={errStyles.title}>Invalid QR Code</Text>
        <Text style={errStyles.subtitle}>
          The scanned code could not be verified. It may be expired, already used, or for a different order.
        </Text>

        <View style={errStyles.reasonCard}>
          <Text style={errStyles.reasonLabel}>Possible Reasons:</Text>
          <View style={errStyles.bulletRow}>
            <View style={errStyles.bullet} />
            <Text style={errStyles.bulletText}>QR code has already been scanned</Text>
          </View>
          <View style={errStyles.bulletRow}>
            <View style={errStyles.bullet} />
            <Text style={errStyles.bulletText}>Customer is showing an old screenshot</Text>
          </View>
          <View style={errStyles.bulletRow}>
            <View style={errStyles.bullet} />
            <Text style={errStyles.bulletText}>Network sync error</Text>
          </View>
        </View>

        <View style={errStyles.actions}>
          <TouchableOpacity
            style={errStyles.primaryBtn}
            onPress={() => router.back()}
          >
            <RefreshCcw size={20} color={COLORS.WHITE} />
            <Text style={errStyles.primaryBtnText}>Try Scanning Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={errStyles.secondaryBtn}
            onPress={() => router.push('/(protected)/(staff)/home')}
          >
            <ArrowLeft size={18} color={COLORS.TEXT_PRIMARY} />
            <Text style={errStyles.secondaryBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={errStyles.helpBtn}>
          <HelpCircle size={20} color={COLORS.TEXT_SECONDARY} />
          <Text style={errStyles.helpText}>Contact Support for Help</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const errStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#EF4444',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 40,
    opacity: 0.8,
  },
  reasonCard: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 40,
  },
  reasonLabel: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '800',
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  bulletText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: '#B91C1C',
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
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  secondaryBtnText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '800',
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  helpText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default InvalidQrScreen;

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Info, Keyboard } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import ScanHeader from './components/ScanHeader';
import ScanIcon from './components/ScanIcon';
import ScanButton from './components/ScanButton';
import ConfirmationCard from './components/ConfirmationCard';
import ErrorCard from './components/ErrorCard';

const { height } = Dimensions.get('window');

/**
 * Main Scanning Screen for Staff.
 * Features the viewfinder, guided instructions, and result overlays.
 * Simulates a successful scan flow for demonstration excellence.
 */
const ScanLandingScreen = () => {
  const router = useRouter();
  const [showResult, setShowResult] = useState<'NONE' | 'SUCCESS' | 'ERROR'>('NONE');
  const [flashActive, setFlashActive] = useState(false);

  const simulateScan = () => {
    // Simulated successful scan after a short delay
    setTimeout(() => {
      setShowResult('SUCCESS');
    }, 1000);
  };

  return (
    <ScreenWrapper 
      statusBarColor={COLORS.BLACK} 
      barStyle="light-content"
      style={{ backgroundColor: COLORS.BLACK }}
      scroll
    >
      <View style={scanStyles.viewfinder}>
        <View style={scanStyles.overlayLayer}>
          <View style={scanStyles.unfocused} />
          <View style={scanStyles.focusedRow}>
            <View style={scanStyles.unfocused} />
            <View style={scanStyles.focusArea} />
            <View style={scanStyles.unfocused} />
          </View>
          <View style={scanStyles.unfocused} />
        </View>
      </View>

      <ScanHeader
        title="Scan Order QR"
        onFlashToggle={() => setFlashActive(!flashActive)}
        flashActive={flashActive}
      />

      <View style={scanStyles.content}>
        <View style={scanStyles.instructionWrapper}>
          <Text style={scanStyles.mainInstruction}>Position QR code within the frame</Text>
          <Text style={scanStyles.subInstruction}>Scanning will start automatically</Text>
        </View>

        <ScanIcon />

        <View style={scanStyles.footer}>
          <View style={scanStyles.tipBox}>
            <Info size={16} color={COLORS.WHITE} />
            <Text style={scanStyles.tipText}>Point at the customer's phone screen</Text>
          </View>

          <ScanButton
            label="Simulate Successful Scan"
            onPress={simulateScan}
            style={{ marginBottom: 16 }}
          />

          <ScanButton
            label="Enter Order ID Manually"
            icon={Keyboard}
            variant="secondary"
            onPress={() => { }}
          />
        </View>
      </View>

      {/* Result Overlays */}
      {showResult === 'SUCCESS' && (
        <ConfirmationCard
          type="PICKUP"
          orderId="ORD-8890"
          customer="John Doe"
          address="No. 123, Ward Place, Colombo 07"
          onConfirm={() => router.push('/(protected)/(staff)/home')}
          onCancel={() => setShowResult('NONE')}
        />
      )}

      {showResult === 'ERROR' && (
        <ErrorCard
          message="This QR code has already been used or is expired. Please ask the customer for a fresh code."
          onRetry={() => setShowResult('NONE')}
          onClose={() => router.back()}
        />
      )}
    </ScreenWrapper>
  );
};

const scanStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E293B', // Dark camera-like feel
  },
  overlayLayer: {
    flex: 1,
  },
  unfocused: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  focusedRow: {
    height: 240,
    flexDirection: 'row',
  },
  focusArea: {
    width: 240,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  instructionWrapper: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  mainInstruction: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subInstruction: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tipText: {
    color: COLORS.WHITE,
    fontSize: 13,
    fontWeight: '600',
  }
});

export default ScanLandingScreen;

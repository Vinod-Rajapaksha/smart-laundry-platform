import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ticket, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Input from '../../../components/common/Input';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Vouchers.styles';
import api from '../../../services/api';

const RedeemVoucherScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRedeem = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter a voucher code');
      return;
    }

    try {
      setLoading(true);
      // Validate voucher with a mock amount of 1000 for checking viability
      const response = await api.post('/promotions/validate', { code, orderAmount: 1000 });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.back();
        }, 2000);
      }
    } catch (error: any) {
      Alert.alert('Invalid Code', error.response?.data?.message || 'This voucher cannot be redeemed.');
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
    </View>
  );

  if (success) {
    return (
      <ScreenWrapper scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <CheckCircle2 size={100} color="#16A34A" />
          <Text style={[styles.redeemTitle, { marginTop: 20 }]}>Voucher Collected!</Text>
          <Text style={[styles.redeemDesc, { textAlign: 'center' }]}>
            Your voucher has been successfully added to your account. You can apply it during checkout.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={styles.inputContainer}>
        <Ticket size={40} color={COLORS.PRIMARY} style={{ marginBottom: 20 }} />
        <Text style={styles.redeemTitle}>Have a promo code?</Text>
        <Text style={styles.redeemDesc}>
          Enter your special code below to unlock rewards and discounts.
        </Text>

        <Input
          placeholder="e.g. SAVE50"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[
            { backgroundColor: COLORS.PRIMARY, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
            loading && { backgroundColor: '#CBD5E1' }
          ]}
          onPress={handleRedeem}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Redeem Code</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default RedeemVoucherScreen;

import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { paymentService } from '../../../services/customer/paymentService';

const ProcessingScreen = () => {
  const router = useRouter();
  const { orderId, method, total } = useLocalSearchParams();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await paymentService.getPaymentStatus(orderId as string);
        if (data.status === 'PAID') {
          router.replace({
            pathname: '/(protected)/(customer)/checkout/PaymentStatusScreen',
            params: { success: 'true', orderId, method, total }
          });
        } else {
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };

    checkStatus();
  }, []);

  return (
    <ScreenWrapper statusBarColor={COLORS.WHITE} scroll={false}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.title}>Processing Payment</Text>
        <Text style={styles.message}>
          Please do not close the app or go back. We are verifying your transaction with the bank.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 24,
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProcessingScreen;

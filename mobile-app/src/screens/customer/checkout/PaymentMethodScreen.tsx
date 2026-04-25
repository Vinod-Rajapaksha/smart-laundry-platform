import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CreditCard, Building2, Banknote, ArrowRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import styles from './styles/Checkout.styles';

const PAYMENT_METHODS = [
  {
    id: 'CARD',
    title: 'Credit/Debit Card',
    desc: 'Pay securely with Visa, Mastercard, or Amex',
    icon: CreditCard,
    route: '/(protected)/(customer)/checkout/card-payment'
  },
  {
    id: 'BANK_TRANSFER',
    title: 'Bank Transfer',
    desc: 'Direct transfer via secure banking portal',
    icon: Building2,
    route: '/(protected)/(customer)/checkout/bank-transfer'
  },
  {
    id: 'COD',
    title: 'Cash on Delivery',
    desc: 'Pay when your clean laundry arrives',
    icon: Banknote,
    route: '/(protected)/(customer)/checkout/cash-on-delivery'
  },
];

const PaymentMethodScreen = () => {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('CARD');

  const handleContinue = () => {
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    if (method) {
      router.push({
        pathname: method.route as any,
        params: { orderId, total }
      });
    }
  };

  return (
    <ScreenWrapper
      header={<AppHeader title="Checkout" />}
      footer={
        <View style={styles.footer}>
          <Button
            title="Continue"
            rightIcon={<ArrowRight color={COLORS.WHITE} size={20} />}
            onPress={handleContinue}
            size="lg"
          />
          <Text style={{ textAlign: 'center', fontSize: 10, color: COLORS.TEXT_MUTED, marginTop: 12 }}>
            By tapping continue, you agree to B & W Laundry's{'\n'}
            Terms of Service and Privacy Policy.
          </Text>
        </View>
      }
      scroll
    >
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.sectionSubtitle}>
          Choose how you'd like to pay for your laundry service.
        </Text>

        {PAYMENT_METHODS.map((method) => {
          const isActive = selectedMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.selectionCard, isActive && styles.selectionCardActive]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.8}
            >
              <View style={styles.selectionIcon}>
                <method.icon color={isActive ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} size={24} />
              </View>
              <View style={styles.selectionContent}>
                <Text style={styles.selectionTitle}>{method.title}</Text>
                <Text style={styles.selectionDesc}>{method.desc}</Text>
              </View>
              <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                {isActive && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Amount Summary Box */}
        <View style={[styles.card, { backgroundColor: '#F8FAFC', borderStyle: 'dotted', marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY, fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM }}>Total Amount</Text>
              <Text style={{ fontSize: 10, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>Includes Delivery Fee</Text>
            </View>
            <Text style={{ fontSize: 22, fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD, color: COLORS.TEXT_PRIMARY }}>
              Rs {total || '0.00'}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

export default PaymentMethodScreen;
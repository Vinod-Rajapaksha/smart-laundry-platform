import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAddress, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Address.styles';

const AddressScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pickupAddress, deliveryAddress } = useAppSelector((state) => state.reservation);

  const [pickup, setPickup] = useState(pickupAddress || '');
  const [delivery, setDelivery] = useState(deliveryAddress || '');
  const [sameAsPickup, setSameAsPickup] = useState(true);

  const handleNext = () => {
    dispatch(setAddress({ 
      pickup, 
      delivery: sameAsPickup ? pickup : delivery 
    }));
    dispatch(nextStep());
    router.push('/(protected)/(customer)/reservation/reservation-summary');
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <View style={commonStyles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={[commonStyles.stepDot, s <= 5 && commonStyles.stepDotActive]} />
        ))}
      </View>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity 
        style={[commonStyles.primaryButton, !pickup && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!pickup}
      >
        <Text style={commonStyles.primaryButtonText}>Continue to Summary</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll
      withKeyboardAvoidingView
    >
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Where are you located?</Text>
        <Text style={commonStyles.subtitle}>
          Provide your address for pickup and delivery.
          </Text>

        <View style={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Address</Text>
            <TextInput
              style={styles.input}
              placeholder="House no, Street name, City..."
              placeholderTextColor={COLORS.TEXT_MUTED}
              multiline
              value={pickup}
              onChangeText={setPickup}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            {!sameAsPickup && (
              <TextInput
                style={styles.input}
                placeholder="House no, Street name, City..."
                placeholderTextColor={COLORS.TEXT_MUTED}
                multiline
                value={delivery}
                onChangeText={setDelivery}
              />
            )}
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setSameAsPickup(!sameAsPickup)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, sameAsPickup && styles.checkboxActive]}>
                 {sameAsPickup && <Check size={14} color={COLORS.WHITE} />}
              </View>
              <Text style={styles.checkboxLabel}>Same as pickup address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddressScreen;

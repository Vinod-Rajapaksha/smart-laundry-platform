import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Thermometer, Zap, ChevronLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { nextStep, prevStep, setNotes } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/WashPreferences.styles';

const TEMP_OPTIONS = ['Cold', '30°C', '40°C', '60°C'];
const SPIN_OPTIONS = ['Low', 'Normal', 'High', 'No Spin'];

const WashPreferencesScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notes } = useAppSelector((state) => state.reservation);
  
  const [temp, setTemp] = useState('Cold');
  const [spin, setSpin] = useState('Normal');

  const handleNext = () => {
    const prefString = `Wash: ${temp}, Spin: ${spin}. ${notes || ''}`;
    dispatch(setNotes(prefString));
    dispatch(nextStep());
    router.push('/(protected)/(customer)/reservation/detergents');
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <View style={commonStyles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={[commonStyles.stepDot, s <= 2 && commonStyles.stepDotActive]} />
        ))}
      </View>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity style={commonStyles.primaryButton} onPress={handleNext}>
        <Text style={commonStyles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll
    >
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Wash Preferences</Text>
        <Text style={commonStyles.subtitle}>
          Set your preferred temperature and spin speed for your garments.
        </Text>

        <View style={styles.scrollContent}>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Thermometer size={20} color={COLORS.PRIMARY} />
               <Text style={styles.sectionTitle}>Water Temperature</Text>
            </View>
            <View style={styles.optionGrid}>
              {TEMP_OPTIONS.map((opt) => (
                <TouchableOpacity 
                  key={opt} 
                  onPress={() => setTemp(opt)}
                  style={[styles.optionBtn, temp === opt && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionText, temp === opt && styles.whiteText]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Zap size={20} color={COLORS.PRIMARY} />
               <Text style={styles.sectionTitle}>Spin Speed</Text>
            </View>
            <View style={styles.optionGrid}>
              {SPIN_OPTIONS.map((opt) => (
                <TouchableOpacity 
                  key={opt} 
                  onPress={() => setSpin(opt)}
                  style={[styles.optionBtn, spin === opt && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionText, spin === opt && styles.whiteText]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WashPreferencesScreen;

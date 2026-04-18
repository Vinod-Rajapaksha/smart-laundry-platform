import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WashingMachine } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Onboarding.styles';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container} scroll={false}>
      <View style={styles.content}>
        <View style={[styles.imageContainer, { backgroundColor: '#F0F9FF', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }]}>
          <WashingMachine size={120} color={COLORS.PRIMARY} />
        </View>

        <Text style={styles.title}>Smart Laundry,{'\n'}Smater Living</Text>
        <Text style={styles.subtitle}>
          Premium laundry services at your doorstep. Clean, fresh, and delivered on time.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(public)/onboarding/onboarding')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(public)/auth/login')}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

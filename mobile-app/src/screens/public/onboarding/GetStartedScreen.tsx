import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Rocket } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Onboarding.styles';

const GetStartedScreen = () => {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container} scroll={false}>
      <View style={styles.content}>
        <View style={[styles.imageContainer, { backgroundColor: '#F5F3FF', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }]}>
          <Rocket size={120} color={COLORS.PRIMARY} />
        </View>

        <Text style={styles.title}>All Set!</Text>
        <Text style={styles.subtitle}>
          Your laundry experience is about to change forever. Ready to experience the future of clean?
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(public)/auth/register')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(public)/auth/login')}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default GetStartedScreen;

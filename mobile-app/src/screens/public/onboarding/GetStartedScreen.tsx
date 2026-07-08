import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Rocket } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Onboarding.styles';

const GetStartedScreen = () => {
  const router = useRouter();

  const handleCreateAccount = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    router.push('/(public)/auth/register');
  };

  const handleSignIn = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    router.push('/(public)/auth/login');
  };

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
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSignIn}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default GetStartedScreen;

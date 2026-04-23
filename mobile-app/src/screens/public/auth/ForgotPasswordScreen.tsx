import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Input from '../../../components/common/Input';
import { COLORS } from '../../../theme/colors';
import styles from './styles/auth.styles';
import api from '../../../services/api';
import { notify } from '../../../utils/notify';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      notify.error('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        router.push({
          pathname: '/(public)/auth/otp-verification',
          params: { email }
        });
      }
    } catch (error: any) {
      notify.error('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper
      style={styles.container}
      scroll
    >
      <View style={styles.content}>
        <TouchableOpacity style={{ marginBottom: 24 }} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you an OTP to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <Input
              placeholder="e.g. name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={COLORS.TEXT_SECONDARY} />}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;

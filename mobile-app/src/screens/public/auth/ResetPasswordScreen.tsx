import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Input from '../../../components/common/Input';
import { COLORS } from '../../../theme/colors';
import styles from './styles/auth.styles';
import api from '../../../services/api';
import { notify } from '../../../utils/notify';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) {
      notify.error('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      notify.error('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword: password
      });

      if (response.data.success) {
        notify.alert('Success', 'Your password has been reset successfully.', () => {
          router.push('/(public)/auth/login');
        });
      }
    } catch (error: any) {
      notify.error('Error', error.response?.data?.message || 'Failed to reset password');
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
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            Create a new password that is easy to remember but hard to guess.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <Input
              placeholder="Min 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Lock size={20} color={COLORS.TEXT_SECONDARY} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={COLORS.TEXT_SECONDARY} /> : <Eye size={20} color={COLORS.TEXT_SECONDARY} />}
                </TouchableOpacity>
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <Input
              placeholder="Repeat your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Lock size={20} color={COLORS.TEXT_SECONDARY} />}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Update Password'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ResetPasswordScreen;

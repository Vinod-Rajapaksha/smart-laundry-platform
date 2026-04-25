import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../../../../theme/colors';
import profileService from '../../../../services/customer/profileService';
import { notify } from '../../../../utils/notify';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify.error('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      notify.error('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        handleReset();
      }, 2000);
    } catch (error: any) {
      notify.error('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Password</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconBox}>
                <ShieldCheck size={40} color={COLORS.SUCCESS} />
              </View>
              <Text style={styles.successTitle}>Security Updated!</Text>
              <Text style={styles.successSubtitle}>Your account password has been updated securely.</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Old Password</Text>
                <View style={styles.passwordWrapper}>
                  <Lock size={18} color={COLORS.TEXT_MUTED} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showCurrent}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Verify old password"
                  />
                  <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff size={20} color={COLORS.TEXT_MUTED} /> : <Eye size={20} color={COLORS.TEXT_MUTED} />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordWrapper}>
                  <Lock size={18} color={COLORS.TEXT_MUTED} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter 6+ characters"
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff size={20} color={COLORS.TEXT_MUTED} /> : <Eye size={20} color={COLORS.TEXT_MUTED} />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.passwordWrapper}>
                  <Lock size={18} color={COLORS.TEXT_MUTED} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-type new password"
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={20} color={COLORS.TEXT_MUTED} /> : <Eye size={20} color={COLORS.TEXT_MUTED} />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={styles.buttonText}>Change Password</Text>}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 450,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  form: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default ChangePasswordModal;

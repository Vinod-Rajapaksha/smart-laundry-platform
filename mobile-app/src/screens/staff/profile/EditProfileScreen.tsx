import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import profileService from '../../../services/customer/profileService';
import { UserProfile } from '../../../types/user.types';
import { notify } from '../../../utils/notify';

/**
 * Screen for Staff to edit their personal profile information.
 * Integrated with the main profile service for real data updates.
 */
const StaffEditProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profile: UserProfile | null = params.profileStr ? JSON.parse(params.profileStr as string) : null;

  const [name, setName] = useState(profile?.name || '');
  const [telephone, setTelephone] = useState(profile?.telephone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !telephone.trim()) {
      notify.error('Validation Error', 'Name and telephone are required.');
      return;
    }

    setSaving(true);
    try {
      await profileService.updateProfile({ name, telephone });
      notify.success('Success', 'Staff profile updated successfully!');
      router.back();
    } catch (error: any) {
      notify.error('Update Failed', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <ChevronLeft size={28} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>Edit Staff Info</Text>
    </View>
  );

  return (
    <ScreenWrapper
      style={styles.safeArea}
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.TEXT_MUTED}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            placeholder="e.g. 0771234567"
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Work Email (Permanent)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#F8FAFC', color: COLORS.TEXT_MUTED }]}
            value={profile?.email || ''}
            editable={false}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>Update Staff Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default StaffEditProfileScreen;

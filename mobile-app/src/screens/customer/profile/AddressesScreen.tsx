import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import profileService from '../../../services/customer/profileService';

const AddressesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialAddress = params.address as string || '';

  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await profileService.updateProfile({ address });
      Alert.alert('Success', 'Address updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update address');
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <ChevronLeft size={28} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>Saved Address</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Primary Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="House, Street, City..."
            placeholderTextColor={COLORS.TEXT_MUTED}
            multiline
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
            <Text style={styles.submitButtonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default AddressesScreen;

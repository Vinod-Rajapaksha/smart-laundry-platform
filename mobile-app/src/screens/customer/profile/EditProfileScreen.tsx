import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Avatar from '../../../components/common/Avatar';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import profileService from '../../../services/customer/profileService';
import { UserProfile } from '../../../types/user.types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateUser } from '../../../store/slices/auth.slice';

const EditProfileScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const params = useLocalSearchParams();
  const profile: UserProfile | null = params.profileStr ? JSON.parse(params.profileStr as string) : null;

  const [name, setName] = useState(profile?.name || '');
  const [telephone, setTelephone] = useState(profile?.telephone || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [avatar, setAvatar] = useState(profile?.avatar || null);
  const [saving, setSaving] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setAvatar(selectedImage.uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !telephone.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    setSaving(true);
    try {
      let updatedProfile = profile as UserProfile;

      // 1. Update text fields
      updatedProfile = await profileService.updateProfile({ name, telephone, email });

      // 2. Update avatar if changed
      if (avatar && avatar !== profile?.avatar) {
        const formData = new FormData();
        const filename = avatar.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('avatar', {
          uri: avatar,
          name: filename,
          type,
        } as any);

        updatedProfile = await profileService.uploadAvatar(formData);
      }

      // Update global state
      dispatch(updateUser(updatedProfile));

      // Update persistence
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, ...updatedProfile }));
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <ChevronLeft size={28} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>Edit Profile</Text>
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
        {/* Avatar Editor */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View>
            <Avatar name={name} source={avatar} size={100} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: COLORS.PRIMARY,
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: COLORS.WHITE,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handlePickImage}
            >
              <Camera size={16} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>

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
          <Text style={styles.label}>Phone Number</Text>
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
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType="email-address"
            autoCapitalize="none"
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
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfileScreen;

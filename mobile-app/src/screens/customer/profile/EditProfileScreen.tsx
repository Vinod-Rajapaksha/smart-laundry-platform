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
import { notify } from '../../../utils/notify';
import { profileSchema } from '../../../validation/profile.schema';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const validation = profileSchema.safeParse({ name, telephone, email });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        newErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      let updatedProfile = profile as UserProfile;

      updatedProfile = await profileService.updateProfile({ name, telephone, email });

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

      dispatch(updateUser(updatedProfile));

      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, ...updatedProfile }));
      }

      notify.alert('Success', 'Profile updated successfully!', () => router.back());
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
            style={[styles.input, errors.name && { borderColor: COLORS.ERROR }]}
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.TEXT_MUTED}
          />
          {errors.name && <Text style={{ color: COLORS.ERROR, fontSize: 10, marginTop: 4 }}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.telephone && { borderColor: COLORS.ERROR }]}
            value={telephone}
            onChangeText={(val) => {
              setTelephone(val);
              if (errors.telephone) setErrors(prev => ({ ...prev, telephone: '' }));
            }}
            placeholder="e.g. 0771234567"
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType="phone-pad"
          />
          {errors.telephone && <Text style={{ color: COLORS.ERROR, fontSize: 10, marginTop: 4 }}>{errors.telephone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && { borderColor: COLORS.ERROR }]}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={{ color: COLORS.ERROR, fontSize: 10, marginTop: 4 }}>{errors.email}</Text>}
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

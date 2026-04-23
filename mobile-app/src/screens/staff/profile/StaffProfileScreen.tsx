import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { User, Bell, Shield, Settings, LogOut, ChevronRight, Edit2, MapPin } from 'lucide-react-native';
import { useAppDispatch } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/auth.slice';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import profileService from '../../../services/customer/profileService';
import { UserProfile } from '../../../types/user.types';
import { notify } from '../../../utils/notify';
import Avatar from '../../../components/common/Avatar';

const StaffProfileScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error: any) {
      notify.error('Fetch Error', error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    notify.confirm(
      'Logout',
      'Are you sure you want to log out from the Staff Portal?',
      async () => {
        await dispatch(logoutUser());
        router.replace('/(public)/auth/login');
      },
      'Logout'
    );
  };

  if (loading && !profile) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Staff Profile</Text>
    </View>
  );

  return (
    <ScreenWrapper header={header} scroll={true}>
      <View style={styles.scrollContent}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar
            name={profile?.name || 'Staff'}
            source={profile?.avatar}
            size={70}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>{profile?.name}</Text>
            <Text style={styles.emailText}>{profile?.email}</Text>
            <Text style={styles.phoneText}>{profile?.telephone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/(protected)/(staff)/profile/edit-profile',
              params: { profileStr: JSON.stringify(profile) }
            })}
          >
            <Edit2 size={18} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.menuCard}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push({
                pathname: '/(protected)/(staff)/profile/edit-profile',
                params: { profileStr: JSON.stringify(profile) }
              })}
            >
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <User size={20} color="#3B82F6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Personal Details</Text>
                <Text style={styles.menuSubtitle}>Update name and email</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push({ pathname: '/(protected)/(staff)/profile/addresses', params: { address: profile?.address || '' } })}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <MapPin size={20} color="#22C55E" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Saved Addresses</Text>
                <Text style={styles.menuSubtitle}>Manage your work locations</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(protected)/(staff)/profile/settings')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                <Settings size={20} color="#4B5563" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>App Settings</Text>
                <Text style={styles.menuSubtitle}>Manage app preferences</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => router.push('/(protected)/(staff)/profile/settings')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <Shield size={20} color="#22C55E" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Security</Text>
                <Text style={styles.menuSubtitle}>Password and privacy</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <Bell size={20} color="#F97316" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Announcements</Text>
                <Text style={styles.menuSubtitle}>Stay updated with platform news</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#E11D48" />
          <Text style={styles.logoutText}>Logout from Staff Portal</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default StaffProfileScreen;
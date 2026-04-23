import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, MapPin, Bell, Shield, LogOut, ChevronRight, Edit2, Star, Crown } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/auth.slice';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import { notify } from '../../../utils/notify';
import Avatar from '../../../components/common/Avatar';

const CustomerProfileScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    notify.confirm(
      'Logout',
      'Are you sure you want to log out?',
      async () => {
        await dispatch(logoutUser());
        router.replace('/(public)/auth/login');
      },
      'Logout'
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Profile</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={styles.scrollContent}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar
            name={profile?.name || 'User'}
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
            onPress={() => router.push({ pathname: '/(protected)/(customer)/profile/edit-profile', params: { profileStr: JSON.stringify(profile) } })}
          >
            <Edit2 size={18} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuCard}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push({ pathname: '/(protected)/(customer)/profile/edit-profile', params: { profileStr: JSON.stringify(profile) } })}
            >
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <User size={20} color="#3B82F6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Personal Information</Text>
                <Text style={styles.menuSubtitle}>Update your name, phone and email</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push({ pathname: '/(protected)/(customer)/profile/addresses', params: { address: profile?.address || '' } })}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <MapPin size={20} color="#22C55E" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Saved Addresses</Text>
                <Text style={styles.menuSubtitle}>Manage delivery locations</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(protected)/(customer)/profile/notifications')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <Bell size={20} color="#F97316" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Notifications</Text>
                <Text style={styles.menuSubtitle}>Manage your alert preferences</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(protected)/(customer)/profile/feedback-history')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <Star size={20} color="#16A34A" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>My Reviews</Text>
                <Text style={styles.menuSubtitle}>View and manage your feedback</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => router.push('/(protected)/(customer)/profile/settings')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                <Shield size={20} color="#4B5563" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Security & Privacy</Text>
                <Text style={styles.menuSubtitle}>Password and security settings</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Loyalty & Membership */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards & Benefits</Text>
          <View style={styles.menuCard}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(protected)/(customer)/loyalty')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Star size={20} color="#D97706" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Loyalty Program</Text>
                <Text style={styles.menuSubtitle}>View points and reward history</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => router.push('/(protected)/(customer)/loyalty/membership')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                <Crown size={20} color="#7C3AED" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Membership Tier</Text>
                <Text style={styles.menuSubtitle}>Upgrade and view exclusive perks</Text>
              </View>
              <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#E11D48" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
};

export default CustomerProfileScreen;

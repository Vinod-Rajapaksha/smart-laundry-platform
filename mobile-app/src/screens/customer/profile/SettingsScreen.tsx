import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Shield, Info, Trash2, ChevronRight, Moon } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import ChangePasswordModal from './components/ChangePasswordModal';
import { notify } from '../../../utils/notify';
import { useAppDispatch } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/auth.slice';
import profileService from '../../../services/customer/profileService';

const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        { label: 'Language', icon: <Globe size={20} color={COLORS.PRIMARY} />, value: 'English (US)', onPress: () => { } },
        { label: 'Security', icon: <Shield size={20} color={COLORS.SUCCESS} />, value: 'Password & Biometrics', onPress: () => setPasswordModalVisible(true) },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { label: 'Dark Mode', icon: <Moon size={20} color="#8B5CF6" />, value: 'System Default', onPress: () => { } },
        { label: 'Data Usage', icon: <Info size={20} color="#F59E0B" />, value: 'Optimized', onPress: () => { } },
      ]
    }
  ];

  const handleDeleteAccount = () => {
    notify.confirm(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
      async () => {
        try {
          await profileService.deleteProfile();
          notify.success('Success', 'Your account has been deleted.');
          await dispatch(logoutUser());
          router.replace('/(public)/auth/login');
        } catch (error: any) {
          notify.error('Error', error.message || 'Failed to delete account');
        }
      },
      'Delete'
    );
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      style={styles.safeArea}
      header={header}
      scroll
    >
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.menuItemLast
                ]}
                onPress={item.onPress}
              >
                <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                  {item.icon}
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.value}</Text>
                </View>
                <ChevronRight size={18} color={COLORS.TEXT_MUTED} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
        <TouchableOpacity
          style={[styles.menuCard, { borderColor: '#FECACA', borderWidth: 1 }]}
          onPress={handleDeleteAccount}
        >
          <View style={[styles.menuItem, styles.menuItemLast]}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Trash2 size={20} color="#EF4444" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Delete Account</Text>
              <Text style={styles.menuSubtitle}>Permanently remove all your data</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={settingStyles.footer}>
        <Text style={settingStyles.versionText}>Smart Laundry v1.0.4 (Build 2240)</Text>
        <Text style={settingStyles.copyrightText}>© 2024 B & W Laundry Services</Text>
      </View>
    </ScreenWrapper>
  );
};

const settingStyles = StyleSheet.create({
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  }
});

export default SettingsScreen;

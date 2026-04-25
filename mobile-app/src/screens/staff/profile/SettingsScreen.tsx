import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Globe, Shield, Moon, Info, Trash2, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import { notify } from '../../../utils/notify';
import ChangePasswordModal from './components/ChangePasswordModal';

const StaffSettingsScreen = () => {
  const router = useRouter();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const settingsSections = [
    {
      title: 'Portal Settings',
      items: [
        { label: 'Language', icon: <Globe size={20} color={COLORS.PRIMARY} />, value: 'English (US)', onPress: () => { } },
        { label: 'Security', icon: <Shield size={20} color={COLORS.SUCCESS} />, value: 'Account Security', onPress: () => setPasswordModalVisible(true) },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { label: 'Dark Mode', icon: <Moon size={20} color="#8B5CF6" />, value: 'System Default', onPress: () => { } },
        { label: 'Notifications', icon: <Info size={20} color="#F59E0B" />, value: 'Interactive', onPress: () => { } },
      ]
    }
  ];

  const handleDeleteAccount = () => {
    notify.confirm(
      'Request Data Deletion',
      'As a staff member, your account deletion must be processed by HR. Would you like to send a request?',
      () => notify.success('Sent', 'Deletion request sent to admin.'),
      'Send Request'
    );
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <ChevronLeft size={28} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>Settings</Text>
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
      <View style={styles.scrollContent}>
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

        {/* Support Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administrative</Text>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.menuItem, styles.menuItemLast]}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                <Trash2 size={20} color="#EF4444" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={styles.menuSubtitle}>Submit a termination request</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default StaffSettingsScreen;

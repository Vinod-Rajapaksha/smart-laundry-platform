import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Shield, Map, LogOut, ChevronRight, Zap } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Main Settings screen for Staff users.
 * Includes operational toggles like availability and auto-assignment.
 */
const StaffSettingsScreen = () => {
  const router = useRouter();
  
  const [activeSettings, setActiveSettings] = useState({
    onDuty: true,
    autoClaim: false,
    highPriorityAlerts: true,
    locationSharing: true,
  });

  const toggleSetting = (key: keyof typeof activeSettings) => {
    setActiveSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>App Settings</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ paddingBottom: 40 }}>
        {/* Operational Section */}
        <View style={staffSettingStyles.section}>
          <Text style={staffSettingStyles.sectionLabel}>Duty Status</Text>
          <View style={staffSettingStyles.card}>
            <View style={staffSettingStyles.settingRow}>
              <View style={[staffSettingStyles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <Zap size={20} color={COLORS.SUCCESS_TEXT} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={staffSettingStyles.settingTitle}>On Duty Mode</Text>
                <Text style={staffSettingStyles.settingSubtitle}>Allow new orders to be assigned</Text>
              </View>
              <Switch 
                value={activeSettings.onDuty}
                onValueChange={() => toggleSetting('onDuty')}
                trackColor={{ false: '#E2E8F0', true: COLORS.SUCCESS + '50' }}
                thumbColor={activeSettings.onDuty ? COLORS.SUCCESS : '#F8FAFC'}
              />
            </View>
            <View style={staffSettingStyles.divider} />
            <View style={staffSettingStyles.settingRow}>
              <View style={[staffSettingStyles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Map size={20} color={COLORS.PRIMARY} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={staffSettingStyles.settingTitle}>Live Location</Text>
                <Text style={staffSettingStyles.settingSubtitle}>Share location with customers</Text>
              </View>
              <Switch 
                value={activeSettings.locationSharing}
                onValueChange={() => toggleSetting('locationSharing')}
                trackColor={{ false: '#E2E8F0', true: COLORS.PRIMARY + '50' }}
                thumbColor={activeSettings.locationSharing ? COLORS.PRIMARY : '#F8FAFC'}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={staffSettingStyles.section}>
          <Text style={staffSettingStyles.sectionLabel}>Notifications</Text>
          <View style={staffSettingStyles.card}>
            <View style={staffSettingStyles.settingRow}>
              <View style={[staffSettingStyles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <Bell size={20} color="#F59E0B" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={staffSettingStyles.settingTitle}>High Priority Alerts</Text>
                <Text style={staffSettingStyles.settingSubtitle}>Urgent delivery notifications</Text>
              </View>
              <Switch 
                value={activeSettings.highPriorityAlerts}
                onValueChange={() => toggleSetting('highPriorityAlerts')}
              />
            </View>
          </View>
        </View>

        {/* Account & Security */}
        <View style={staffSettingStyles.section}>
          <Text style={staffSettingStyles.sectionLabel}>Account & Security</Text>
          <View style={staffSettingStyles.card}>
            <TouchableOpacity style={staffSettingStyles.settingRow}>
              <View style={[staffSettingStyles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                <Shield size={20} color={COLORS.TEXT_PRIMARY} />
              </View>
              <Text style={[staffSettingStyles.settingTitle, { flex: 1, marginLeft: 16 }]}>Work Authentication</Text>
              <ChevronRight size={18} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={staffSettingStyles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
          <Text style={staffSettingStyles.logoutText}>Logout as Staff</Text>
        </TouchableOpacity>
        
        <Text style={staffSettingStyles.versionText}>Staff Portal v1.0.4 (internal)</Text>
      </View>
    </ScreenWrapper>
  );
};

const staffSettingStyles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 12,
    padding: 20,
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
  }
});

export default StaffSettingsScreen;

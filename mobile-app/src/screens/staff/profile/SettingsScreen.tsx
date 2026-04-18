import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Globe, Shield, Moon, Info, Trash2, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import { notify } from '../../../utils/notify';

/**
 * Main Settings screen for the Staff portal.
 * Matches the Customer side UI for a consistent platform experience.
 */
const StaffSettingsScreen = () => {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Portal Settings',
      items: [
        { label: 'Language', icon: <Globe size={20} color={COLORS.PRIMARY} />, value: 'English (US)' },
        { label: 'Security', icon: <Shield size={20} color={COLORS.SUCCESS} />, value: 'Account Security' },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { label: 'Dark Mode', icon: <Moon size={20} color="#8B5CF6" />, value: 'System Default' },
        { label: 'Notifications', icon: <Info size={20} color="#F59E0B" />, value: 'Interactive' },
      ]
    }
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Request Data Deletion',
      'As a staff member, your account deletion must be processed by HR. Would you like to send a request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Request', onPress: () => notify.success('Sent', 'Deletion request sent to admin.') }
      ]
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

        <View style={styles.footer}>
          <Text style={styles.versionText}>Staff Portal v1.0.4 (internal)</Text>
          <Text style={styles.copyrightText}>© 2024 B & W Laundry Services</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default StaffSettingsScreen;

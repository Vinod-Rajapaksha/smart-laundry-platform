import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, MessageSquare, Mail, Tag, Truck } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';

/**
 * Screen for managing notification preferences in the Customer profile.
 * Features toggle-based settings for various notification categories.
 */
const ProfileNotificationsScreen = () => {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationSections = [
    {
      title: 'General Settings',
      items: [
        { id: 'pushNotifications', label: 'Push Notifications', icon: <Bell size={20} color={COLORS.PRIMARY} />, description: 'Allow app to send notifications' },
      ]
    },
    {
      title: 'Order Tracking',
      items: [
        { id: 'orderUpdates', label: 'Order Updates', icon: <Truck size={20} color={COLORS.SUCCESS} />, description: 'Pickup, wash status, and delivery' },
      ]
    },
    {
      title: 'Marketing & Offers',
      items: [
        { id: 'promotions', label: 'Promotions', icon: <Tag size={20} color="#F59E0B" />, description: 'Vouchers, discounts and news' },
      ]
    },
    {
      title: 'Other Channels',
      items: [
        { id: 'emailNotifications', label: 'Email Notifications', icon: <Mail size={20} color="#EF4444" />, description: 'Receipts and service updates' },
        { id: 'smsNotifications', label: 'SMS Notifications', icon: <MessageSquare size={20} color="#8B5CF6" />, description: 'Direct alerts for urgent updates' },
      ]
    }
  ];

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ paddingBottom: 40 }}>
        {notificationSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <View 
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
                    <Text style={styles.menuSubtitle}>{item.description}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#E2E8F0', true: COLORS.PRIMARY + '50' }}
                    thumbColor={settings[item.id as keyof typeof settings] ? COLORS.PRIMARY : '#F8FAFC'}
                    ios_backgroundColor="#E2E8F0"
                    onValueChange={() => toggleSetting(item.id as keyof typeof settings)}
                    value={settings[item.id as keyof typeof settings]}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={noticeStyles.footerNote}>
          Note: Critical service alerts regarding active orders cannot be disabled to ensure smooth delivery.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const noticeStyles = StyleSheet.create({
  footerNote: {
    padding: 24,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  }
});

export default ProfileNotificationsScreen;

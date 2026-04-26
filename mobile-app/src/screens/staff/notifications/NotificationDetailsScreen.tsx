import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Screen displaying the full content of a notification for Staff users.
 * Focuses on operational alerts like new orders or delivery updates.
 */
const StaffNotificationDetailsScreen = () => {
  const router = useRouter();
  const { notificationId } = useLocalSearchParams();

  // Mock operational notification
  const notification = {
    id: notificationId || 'STF-NOTIF-555',
    title: 'New Order Claimed',
    message: 'Staff member Vinod has claimed Order #ORD-8890 for pickup. Please ensure all items are ready for the driver by 2:00 PM today.',
    type: 'ASSIGNMENT',
    priority: 'HIGH',
    createdAt: new Date().toISOString()
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT': return <CheckCircle size={32} color={COLORS.SUCCESS} />;
      case 'URGENT': return <AlertTriangle size={32} color={COLORS.ERROR} />;
      default: return <Bell size={32} color={COLORS.PRIMARY} />;
    }
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Alert Details</Text>
        </View>
        <TouchableOpacity>
          <Trash2 size={24} color={COLORS.TEXT_MUTED} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        <View style={staffNotifStyles.detailCard}>
          <View style={[staffNotifStyles.priorityBadge, { backgroundColor: notification.priority === 'HIGH' ? '#FEF2F2' : '#F8FAFC' }]}>
            <Text style={[staffNotifStyles.priorityText, { color: notification.priority === 'HIGH' ? '#DC2626' : COLORS.TEXT_SECONDARY }]}>
              {notification.priority} PRIORITY
            </Text>
          </View>

          <View style={staffNotifStyles.mainInfo}>
            <View style={staffNotifStyles.iconWrapper}>
              {getIcon(notification.type)}
            </View>
            <Text style={staffNotifStyles.notifTitle}>{notification.title}</Text>
            <Text style={staffNotifStyles.timeText}>{new Date(notification.createdAt).toLocaleString()}</Text>
          </View>

          <View style={staffNotifStyles.divider} />

          <Text style={staffNotifStyles.messageText}>
            {notification.message}
          </Text>

          <TouchableOpacity 
            style={staffNotifStyles.primaryBtn}
            onPress={() => router.push('/(protected)/(staff)/home')}
          >
            <Text style={staffNotifStyles.primaryBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={staffNotifStyles.infoBox}>
          <Info size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={staffNotifStyles.infoNote}>
            This alert was generated automatically based on system assignments.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const staffNotifStyles = StyleSheet.create({
  detailCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  notifTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
    marginBottom: 24,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'left',
  },
  primaryBtn: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  primaryBtnText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 12,
    alignItems: 'center',
  },
  infoNote: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  }
});

export default StaffNotificationDetailsScreen;

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bell, Gift, CreditCard, ShoppingBag, Trash2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Notifications.styles';

/**
 * Screen to display the full content of a notification.
 * Includes category-specific icons and a clean, readable layout.
 */
const NotificationDetailsScreen = () => {
  const router = useRouter();
  const { notificationId } = useLocalSearchParams();

  // Mock data for visual excellence - in production this would be fetched from state/API
  const notification = {
    _id: notificationId,
    title: 'Order Delivered!',
    message: 'Your order #ORD-1234 has been delivered successfully. Your clothes are fresh, clean, and ready for you. Thank you for choosing EcoShine Platform!\n\nIf you have any issues with your delivery or the quality of our service, please contact our support team immediately.',
    type: 'ORDER_UPDATE',
    createdAt: new Date().toISOString()
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE': return <ShoppingBag size={48} color={COLORS.PRIMARY} />;
      case 'PROMOTION': return <Gift size={48} color="#F59E0B" />;
      case 'PAYMENT': return <CreditCard size={48} color="#8B5CF6" />;
      default: return <Bell size={48} color={COLORS.PRIMARY} />;
    }
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Details</Text>
      </View>
      <TouchableOpacity>
        <Trash2 size={24} color={COLORS.ERROR} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={[styles.listContent, { padding: 20 }]}>
        <View style={detailStyles.card}>
          <View style={detailStyles.iconWrapper}>
            {getIcon(notification.type)}
          </View>

          <Text style={detailStyles.detailTitle}>{notification.title}</Text>
          <Text style={styles.timeText}>
            {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          <View style={detailStyles.divider} />

          <Text style={detailStyles.paragraph}>
            {notification.message}
          </Text>
        </View>

        <TouchableOpacity 
          style={detailStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={detailStyles.backButtonText}>Back to Notifications</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const detailStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'left',
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 16,
  }
});

export default NotificationDetailsScreen;

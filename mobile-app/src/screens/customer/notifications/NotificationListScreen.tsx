import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Gift, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Notifications.styles';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../../store/slices/customer/notification.slice';
import { NotificationType } from '../../../constants/notifications';

const NotificationListScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state) => state.notifications);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }

    if (notification.data?.orderId) {
      router.push(`/customer/orders/${notification.data.orderId}`);
    }
  };

  const handleClearAll = () => {
    dispatch(markAllAsRead());
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_UPDATE: return <ShoppingBag size={24} color={COLORS.PRIMARY} />;
      case NotificationType.PROMOTION: return <Gift size={24} color="#F59E0B" />;
      case NotificationType.PAYMENT: return <CreditCard size={24} color="#8B5CF6" />;
      default: return <Bell size={24} color={COLORS.PRIMARY} />;
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.notificationItemUnread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.isRead ? '#F1F5F9' : '#DBEAFE' }]}>
        {getIcon(item.type)}
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <ArrowRight size={16} color={COLORS.TEXT_SECONDARY} style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <TouchableOpacity onPress={handleClearAll}>
        <Text style={styles.markReadText}>Clear all</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing && notifications.length === 0) {
    return (
      <ScreenWrapper header={header} scroll={false}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Bell size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
              <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No notifications yet.</Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default NotificationListScreen;

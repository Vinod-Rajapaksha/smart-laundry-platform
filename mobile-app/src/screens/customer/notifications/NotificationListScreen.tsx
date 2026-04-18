import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Gift, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Notifications.styles';

const NotificationListScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      _id: '1',
      title: 'Order Delivered!',
      message: 'Your order #ORD-1234 has been delivered successully. Please rate your experience.',
      type: 'ORDER_UPDATE',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'New Voucher Available',
      message: 'You have a new 50% OFF voucher waiting for you. Redeem it today!',
      type: 'PROMOTION',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE': return <ShoppingBag size={24} color={COLORS.PRIMARY} />;
      case 'PROMOTION': return <Gift size={24} color="#F59E0B" />;
      case 'PAYMENT': return <CreditCard size={24} color="#8B5CF6" />;
      default: return <Bell size={24} color={COLORS.PRIMARY} />;
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.notificationItemUnread]}
      onPress={() => { }}
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
      <TouchableOpacity>
        <Text style={styles.markReadText}>Clear all</Text>
      </TouchableOpacity>
    </View>
  );

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

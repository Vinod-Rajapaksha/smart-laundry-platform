import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Package, Info, AlertTriangle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../../customer/notifications/styles/Notifications.styles';

const StaffNotificationListScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      _id: '1',
      title: 'New Assignment',
      message: 'New order #ORD-5582 has been assigned to you for pickup.',
      type: 'ORDER_UPDATE',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'System Alert',
      message: 'Your duty status was set to OFF by the system due to inactivity.',
      type: 'SYSTEM',
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
      case 'ORDER_UPDATE': return <Package size={24} color={COLORS.PRIMARY} />;
      case 'SYSTEM': return <Info size={24} color="#64748B" />;
      case 'ALERT': return <AlertTriangle size={24} color="#EAB308" />;
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
    </TouchableOpacity>
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>All Alerts</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.markReadText}>Mark all as read</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll={false}
    >
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Bell size={80} color={COLORS.TEXT_SECONDARY} opacity={0.3} />
            <Text style={{ marginTop: 20, color: COLORS.TEXT_SECONDARY, fontSize: 16 }}>No alerts yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default StaffNotificationListScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Info,
  WashingMachine,
  Shirt,
  Pocket,
  Diamond,
} from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import styles from './styles/HomeScreen.styles';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const SERVICES = [
  { id: '1', name: 'Wash & Fold', desc: 'Everyday Items', icon: WashingMachine },
  { id: '2', name: 'Dry Clean', desc: 'Delicate Care', icon: Shirt },
  { id: '3', name: 'Ironing', desc: 'Professional Press', icon: Pocket },
  { id: '4', name: 'Premium', desc: 'Luxury Fabrics', icon: Diamond },
];

const CustomerHomeScreen = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActiveOrder = async () => {
    try {
      const order = await orderService.getActiveOrder();
      setActiveOrder(order);
    } catch (error) {
      console.error('Failed to fetch active order:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveOrder();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveOrder();
  };

  if (loading) return <Loading fullScreen />;

  const header = (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        {user?.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </Text>
          </View>
        )}
        <View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.userName}>Hello, {user?.name?.split(' ')[0] || 'Customer'}!</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(protected)/(customer)/notifications')}>
        <Bell color={COLORS.TEXT_PRIMARY} size={22} />
      </TouchableOpacity>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Button
        title="Make a Reservation"
        onPress={() => router.push('/(protected)/(customer)/reservation/service-mode')}
        size="xl"
        style={styles.reservationButton}
      />
    </View>
  );

  return (
    <ScreenWrapper
      statusBarColor={COLORS.WHITE}
      style={styles.container}
      scroll
      header={header}
      footer={footer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.PRIMARY]}
          tintColor={COLORS.PRIMARY}
        />
      }
    >
      <View style={styles.content}>
        {/* Tracking Card */}
        {activeOrder ? (
          <View style={styles.trackingCard}>
            <View style={styles.trackingHeader}>
              <View>
                <Badge
                  label={`In Progress - ${activeOrder.status.replace('_', ' ')}`}
                  variant="primary"
                />
                <Text style={[styles.trackingTitle, { marginTop: 12 }]}>
                  Order ID: #{activeOrder.orderNo}
                </Text>
                <Text style={styles.trackingSubtitle}>
                  Estimated: Today, 2:00 PM
                </Text>
              </View>
              <View style={[styles.serviceIconContainer, { backgroundColor: COLORS.PRIMARY_SOFT, marginBottom: 0 }]}>
                <WashingMachine color={COLORS.PRIMARY} size={24} />
              </View>
            </View>

            <View style={styles.trackingActions}>
              <Button
                title="Track Order"
                onPress={() => router.push(`/(protected)/(customer)/orders/${activeOrder._id}`)}
                style={styles.trackButton}
              />
              <TouchableOpacity style={styles.infoButton}>
                <Info color={COLORS.TEXT_SECONDARY} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.trackingCard, { alignItems: 'center', paddingVertical: 40 }]}>
            <WashingMachine color={COLORS.PRIMARY_OUTLINE} size={48} />
            <Text style={[styles.trackingSubtitle, { marginTop: 16, textAlign: 'center' }]}>
              No active orders at the moment.
            </Text>
          </View>
        )}

        {/* Services Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIconContainer}>
                <service.icon color={COLORS.PRIMARY} size={28} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDesc}>{service.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CustomerHomeScreen;

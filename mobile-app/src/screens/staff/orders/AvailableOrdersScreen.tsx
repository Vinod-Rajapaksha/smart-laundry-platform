import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  fetchAvailablePickups,
  fetchAvailableDeliveries,
  assignJobThunk,
  fetchMyJobs,
} from '../../../store/slices/staff/staffOrders.slice';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { SPACING } from '../../../theme/spacing';

type TabType = 'pickups' | 'deliveries';

export default function AvailableOrdersScreen() {
    console.log('AvailableOrdersScreen mounted');
  const dispatch = useAppDispatch();
  const { availablePickups, availableDeliveries,myJobs, isLoading, isUpdating } =
    useAppSelector((state) => state.staffOrders);

  const [activeTab, setActiveTab] = useState<TabType>('pickups');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    console.log('loadData called');
    dispatch(fetchAvailablePickups(undefined));
    dispatch(fetchAvailableDeliveries(undefined));
    dispatch(fetchMyJobs(undefined));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchAvailablePickups(undefined)),
      dispatch(fetchAvailableDeliveries(undefined)),
    ]);
    setRefreshing(false);
  };

  const handleAssign = (orderId: string, jobType: 'PICKUP' | 'DELIVERY') => {
    Alert.alert(
      'Confirm Assignment',
      `Assign this ${jobType.toLowerCase()} job to yourself?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: async () => {
            const result = await dispatch(assignJobThunk({ orderId, jobType }));
            if (assignJobThunk.fulfilled.match(result)) {
              Alert.alert('Success', 'Job assigned successfully');
              loadData();
            } else {
              Alert.alert('Error', (result.payload as string) || 'Failed to assign job');
            }
          },
        },
      ]
    );
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>{item.orderNo}</Text>
        </View>
        <Text style={styles.amount}>LKR {item.totalAmount?.toLocaleString()}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={15} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.infoText}>{item.userId?.name || 'Unknown'}</Text>
        <Text style={styles.infoPhone}>{item.userId?.telephone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={15} color={COLORS.PRIMARY} />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.pickupAddress || '—'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="navigate-outline" size={15} color={COLORS.SUCCESS} />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.deliveryAddress || '—'}
        </Text>
      </View>

      <Pressable
        style={[styles.assignButton, isUpdating && styles.assignButtonDisabled]}
        onPress={() => handleAssign(item._id, activeTab === 'pickups' ? 'PICKUP' : 'DELIVERY')}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color={COLORS.WHITE} size="small" />
        ) : (
          <>
            <MaterialCommunityIcons name="motorbike" size={18} color={COLORS.WHITE} />
            <Text style={styles.assignButtonText}>Assign to Me</Text>
          </>
        )}
      </Pressable>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={64}
        color={COLORS.BORDER}
      />
      <Text style={styles.emptyTitle}>No orders available</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'pickups'
          ? 'No pickup orders at the moment'
          : 'No delivery orders at the moment'}
      </Text>
    </View>
  );

  const currentData = activeTab === 'pickups' ? availablePickups : availableDeliveries;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Orders</Text>
        <Text style={styles.headerSubtitle}>
          {currentData.length} order{currentData.length !== 1 ? 's' : ''} available
        </Text>
            <Pressable
                style={styles.myJobsButton}
                onPress={() => router.push('/(protected)/(staff)/orders/assigned')}
                >
                <MaterialCommunityIcons name="clipboard-account-outline" size={16} color={COLORS.PRIMARY} />
                <Text style={styles.myJobsButtonText}>My Jobs ({myJobs.length})</Text>
            </Pressable>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'pickups' && styles.activeTab]}
          onPress={() => setActiveTab('pickups')}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={18}
            color={activeTab === 'pickups' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
          />
          <Text style={[styles.tabText, activeTab === 'pickups' && styles.activeTabText]}>
            Pickups
          </Text>
          {availablePickups.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{availablePickups.length}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'deliveries' && styles.activeTab]}
          onPress={() => setActiveTab('deliveries')}
        >
          <Ionicons
            name="arrow-down-circle-outline"
            size={18}
            color={activeTab === 'deliveries' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
          />
          <Text style={[styles.tabText, activeTab === 'deliveries' && styles.activeTabText]}>
            Deliveries
          </Text>
          {availableDeliveries.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{availableDeliveries.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
    paddingTop: SPACING.SECTION_SM,
    paddingBottom: SPACING.LG,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XXS,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.SCREEN_HORIZONTAL,
    backgroundColor: COLORS.TAB_BACKGROUND,
    borderRadius: SPACING.ROUNDED_SM,
    padding: SPACING.XXS,
    marginBottom: SPACING.SECTION_SM,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
    gap: SPACING.XXS,
    borderRadius: SPACING.LG,
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
  },
  tabText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
  },
  badge: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SPACING.PILL,
    paddingHorizontal: SPACING.XS,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.WHITE,
  },
  listContent: {
    paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
    paddingBottom: SPACING.SECTION_XL,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: SPACING.ROUNDED_MD,
    padding: SPACING.SECTION_SM,
    marginBottom: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  orderBadge: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XXS,
    borderRadius: SPACING.PILL,
  },
  orderBadgeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.PRIMARY,
  },
  amount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    marginBottom: SPACING.SM,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  infoPhone: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SPACING.ROUNDED_SM,
    paddingVertical: SPACING.LG,
    gap: SPACING.XS,
    marginTop: SPACING.SM,
  },
  assignButtonDisabled: {
    backgroundColor: COLORS.PRIMARY_DISABLED,
  },
  assignButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.LG,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: SPACING.LG,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  myJobsButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: SPACING.XXS,
  marginTop: SPACING.SM,
  alignSelf: 'flex-start',
  backgroundColor: COLORS.PRIMARY_LIGHT,
  paddingHorizontal: SPACING.SM,
  paddingVertical: SPACING.XXS,
  borderRadius: SPACING.PILL,
},
myJobsButtonText: {
  fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
  color: COLORS.PRIMARY,
},
});
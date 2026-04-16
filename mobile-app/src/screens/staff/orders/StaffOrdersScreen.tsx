import React, { useEffect, useState } from 'react';
import { useLocation } from '../../../hooks/useLocation';
import { updateLocationThunk } from '../../../store/slices/staff/staffOrders.slice';
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
  fetchMyJobs,
  updateJobStatusThunk,
} from '../../../store/slices/staff/staffOrders.slice';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { SPACING } from '../../../theme/spacing';

export default function StaffOrdersScreen() {
  const dispatch = useAppDispatch();
  const { myJobs, isLoading, isUpdating } =
    useAppSelector((state) => state.staffOrders);

  const [refreshing, setRefreshing] = useState(false);
  const { startTracking, stopTracking, isTracking, hasPermission } = useLocation();

  useEffect(() => {
    dispatch(fetchMyJobs(undefined));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyJobs(undefined));
    setRefreshing(false);
  };

  const handleStatusUpdate = (
    orderId: string,
    currentStatus: string,
    jobType: string
  ) => {
    const nextStatus = getNextStatus(currentStatus, jobType);
    if (!nextStatus) return;

    Alert.alert(
      'Update Status',
      `Mark this order as ${nextStatus.replace('_', ' ')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await dispatch(
              updateJobStatusThunk({ orderId, status: nextStatus })
            );
            if (updateJobStatusThunk.fulfilled.match(result)) {
              // Start tracking when rider starts moving
              if (nextStatus === 'PICKUP_ENROUTE' || nextStatus === 'DELIVERY_ENROUTE') {
                handleStartTracking(orderId);
              }
              // Stop tracking when job is done
              if (nextStatus === 'PICKED_UP' || nextStatus === 'DELIVERED') {
                stopTracking();
              }
              Alert.alert('Success', 'Status updated successfully');
              dispatch(fetchMyJobs(undefined));
            } else {
              Alert.alert('Error', (result.payload as string) || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  const getNextStatus = (currentOrderStatus: string, jobType: string): string | null => {
    if (jobType === 'PICKUP') {
      if (currentOrderStatus === 'PICKUP_ASSIGNED') return 'PICKUP_ENROUTE';
      if (currentOrderStatus === 'PICKUP_ENROUTE') return 'PICKED_UP';
    }
    if (jobType === 'DELIVERY') {
      if (currentOrderStatus === 'DELIVERY_ASSIGNED') return 'DELIVERY_ENROUTE';
      if (currentOrderStatus === 'DELIVERY_ENROUTE') return 'DELIVERED';
    }
    return null;
  };

  const getActionLabel = (currentOrderStatus: string, jobType: string): string => {
    if (jobType === 'PICKUP') {
      if (currentOrderStatus === 'PICKUP_ASSIGNED') return 'Start Pickup';
      if (currentOrderStatus === 'PICKUP_ENROUTE') return 'Mark Picked Up';
    }
    if (jobType === 'DELIVERY') {
      if (currentOrderStatus === 'DELIVERY_ASSIGNED') return 'Start Delivery';
      if (currentOrderStatus === 'DELIVERY_ENROUTE') return 'Mark Delivered';
    }
    return 'Completed';
  };

  const getStatusColor = (jobType: string) => {
    return jobType === 'PICKUP' ? COLORS.PRIMARY : COLORS.SUCCESS_TEXT;
  };

  const getStatusBackground = (jobType: string) => {
    return jobType === 'PICKUP' ? COLORS.PRIMARY_LIGHT : COLORS.SUCCESS_BACKGROUND;
  };

  const handleStartTracking = (orderId: string) => {
  startTracking((latitude, longitude) => {
    dispatch(updateLocationThunk({ orderId, latitude, longitude }));
  });
};

  const renderJobCard = ({ item }: { item: any }) => {
    const order = item.orderId;
    const actionLabel = getActionLabel(order.status, item.jobType);
    const isCompleted = item.jobStatus === 'COMPLETED';
    const nextStatus = getNextStatus(order.status, item.jobType);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.jobTypeBadge, { backgroundColor: getStatusBackground(item.jobType) }]}>
            {item.jobType === 'PICKUP' ? (
              <Ionicons name="arrow-up-circle-outline" size={14} color={getStatusColor(item.jobType)} />
            ) : (
              <MaterialCommunityIcons name="truck-delivery-outline" size={14} color={getStatusColor(item.jobType)} />
            )}
            <Text style={[styles.jobTypeText, { color: getStatusColor(item.jobType) }]}>
              {item.jobType}
            </Text>
          </View>
          <View style={[
            styles.jobStatusBadge,
            item.jobStatus === 'IN_PROGRESS' && styles.inProgressBadge,
            item.jobStatus === 'COMPLETED' && styles.completedBadge,
          ]}>
            <Text style={[
              styles.jobStatusText,
              item.jobStatus === 'IN_PROGRESS' && styles.inProgressText,
              item.jobStatus === 'COMPLETED' && styles.completedText,
            ]}>
              {item.jobStatus.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <Text style={styles.orderNo}>{order.orderNo}</Text>
        <Text style={styles.customerName}>
          {order.userId?.name} · {order.userId?.telephone}
        </Text>

        <View style={styles.divider} />

        <View style={styles.addressRow}>
          <View style={[styles.addressDot, { backgroundColor: COLORS.PRIMARY }]} />
          <View style={styles.addressContent}>
            <Text style={styles.addressLabel}>
              {item.jobType === 'PICKUP' ? 'Pickup from' : 'Collect from laundry'}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.jobType === 'PICKUP' ? order.pickupAddress : 'B&W Laundry, Colombo 07'}
            </Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={[styles.addressDot, { backgroundColor: COLORS.SUCCESS }]} />
          <View style={styles.addressContent}>
            <Text style={styles.addressLabel}>
              {item.jobType === 'PICKUP' ? 'Drop to laundry' : 'Deliver to'}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.jobType === 'PICKUP' ? 'B&W Laundry, Colombo 07' : order.deliveryAddress}
            </Text>
          </View>
        </View>

        {isTracking && (
          <View style={styles.gpsRow}>
            <View style={styles.gpsDot} />
            <Text style={styles.gpsText}>Live GPS Active</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          {order.paymentMethod === 'CASH' && (
            <Text style={styles.amount}>LKR {order.totalAmount?.toLocaleString()}</Text>
          )}
          {!isCompleted && nextStatus && (
            <Pressable
              style={[styles.actionButton, isUpdating && styles.actionButtonDisabled]}
              onPress={() => handleStatusUpdate(order._id, order.status, item.jobType)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color={COLORS.WHITE} size="small" />
              ) : (
                <Text style={styles.actionButtonText}>{actionLabel}</Text>
              )}
            </Pressable>
          )}
          {isCompleted && (
            <View style={styles.completedTag}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.SUCCESS_TEXT} />
              <Text style={styles.completedTagText}>Done</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={64}
        color={COLORS.BORDER}
      />
      <Text style={styles.emptyTitle}>No active jobs</Text>
      <Text style={styles.emptySubtitle}>
        Go to Available Orders to assign yourself a job
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <Text style={styles.headerSubtitle}>
          {myJobs.length} active job{myJobs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={myJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobCard}
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
    marginBottom: SPACING.SM,
  },
  jobTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XXS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XXS,
    borderRadius: SPACING.PILL,
  },
  jobTypeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
  },
  jobStatusBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XXS,
    borderRadius: SPACING.PILL,
    backgroundColor: COLORS.INFO_BACKGROUND,
  },
  inProgressBadge: {
    backgroundColor: '#FFF7ED',
  },
  completedBadge: {
    backgroundColor: COLORS.SUCCESS_BACKGROUND,
  },
  jobStatusText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_SECONDARY,
  },
  inProgressText: {
    color: '#C2410C',
  },
  completedText: {
    color: COLORS.SUCCESS_TEXT,
  },
  orderNo: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XXS,
  },
  customerName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
    marginVertical: SPACING.LG,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  addressDot: {
    width: 8,
    height: 8,
    borderRadius: SPACING.PILL,
    marginTop: 4,
    flexShrink: 0,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  addressText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  amount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.SECTION_SM,
    paddingVertical: SPACING.SM,
    borderRadius: SPACING.ROUNDED_SM,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.PRIMARY_DISABLED,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.WHITE,
  },
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XXS,
  },
  completedTagText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.SUCCESS_TEXT,
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
  gpsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: SPACING.XXS,
  marginTop: SPACING.SM,
},
gpsDot: {
  width: 7,
  height: 7,
  borderRadius: SPACING.PILL,
  backgroundColor: COLORS.SUCCESS,
},
gpsText: {
  fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
  color: COLORS.SUCCESS_TEXT,
},
});
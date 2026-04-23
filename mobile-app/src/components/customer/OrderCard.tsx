import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { Order } from '../../types/order.types';
import styles from './styles/OrderCard.styles';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
  onReviewPress?: (order: Order) => void;
  onViewReviewPress?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onReviewPress,
  onViewReviewPress
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'CANCELLED': return { bg: '#FEF2F2', text: '#DC2626' };
      case 'IN_WASH': return { bg: '#EFF6FF', text: '#2563EB' };
      default: return { bg: '#FEF9C3', text: '#CA8A04' };
    }
  };

  const statusColors = getStatusColor(order.status);
  const canReview = order.status === 'DELIVERED' && !order.isReviewed;
  const hasReviewed = order.isReviewed;

  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{order.orderNo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {order.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Clock size={16} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.detailText}>{new Date(order.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.detailRow}>
        <MapPin size={16} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.detailText} numberOfLines={1}>
          {order.pickupAddress || 'Self Service'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.priceText}>Rs.{order.totalAmount.toFixed(2)}</Text>
        <View style={styles.actions}>
          {canReview && onReviewPress && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => onReviewPress(order)}
            >
              <Text style={styles.reviewButtonText}>Add Review</Text>
            </TouchableOpacity>
          )}
          {hasReviewed && onViewReviewPress && (
            <TouchableOpacity
              style={styles.viewReviewButton}
              onPress={() => onViewReviewPress(order)}
            >
              <Text style={styles.viewReviewButtonText}>View Review</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => onPress(order)}
          >
            <Text style={styles.trackButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

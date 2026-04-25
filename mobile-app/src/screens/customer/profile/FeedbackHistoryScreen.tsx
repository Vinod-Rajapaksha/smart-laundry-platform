import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/FeedbackHistory.styles';
import feedbackService from '../../../services/customer/feedbackService';
import { Feedback } from '../../../types/feedback.types';

const FeedbackHistoryScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const data = await feedbackService.getMyFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const renderItem = ({ item }: { item: Feedback }) => (
    <View style={styles.feedbackCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderNo}>Order #{item.orderId?.orderNo || 'N/A'}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            fill={s <= item.rating ? COLORS.PRIMARY : 'transparent'}
            color={s <= item.rating ? COLORS.PRIMARY : COLORS.BORDER}
          />
        ))}
      </View>

      {item.comment && <Text style={styles.comment}>{item.comment}</Text>}

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Reviews</Text>
    </View>
  );

  return (
    <ScreenWrapper header={header} scroll={false}>
      {feedbacks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageSquare size={64} color={COLORS.BORDER} />
          <Text style={styles.emptyText}>You haven't given any reviews yet.</Text>
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
          }
        />
      )}
    </ScreenWrapper>
  );
};

export default FeedbackHistoryScreen;

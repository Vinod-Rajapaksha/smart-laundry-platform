import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { X, Star, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import styles from './styles/FeedbackModal.styles';
import { Order } from '../../types/order.types';
import { Feedback } from '../../types/feedback.types';
import feedbackService from '../../services/customer/feedbackService';

const FEEDBACK_TAGS = [
  'good service',
  'excellent customer service',
  'on time',
  'reasonable prices',
  'recommended'
];

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  existingFeedback?: Feedback | null;
  onSubmitSuccess?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  order,
  existingFeedback,
  onSubmitSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (existingFeedback) {
      setRating(existingFeedback.rating);
      setComment(existingFeedback.comment || '');
      setSelectedTags(existingFeedback.tags || []);
      setIsReadOnly(true);
    } else {
      setRating(0);
      setComment('');
      setSelectedTags([]);
      setIsReadOnly(false);
      setSubmitted(false);
    }
  }, [existingFeedback, visible]);

  const toggleTag = (tag: string) => {
    if (isReadOnly) return;
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!order || rating === 0 || loading) return;

    setLoading(true);
    try {
      await feedbackService.createFeedback({
        orderId: order._id,
        rating,
        comment,
        tags: selectedTags
      });
      setSubmitted(true);
      onSubmitSuccess?.();
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingText = (val: number) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {submitted ? 'Thank You!' : isReadOnly ? 'Your Review' : 'Give Feedback'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X color={COLORS.TEXT_PRIMARY} size={24} />
            </TouchableOpacity>
          </View>

          {submitted ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <CheckCircle2 color="#10B981" size={48} />
              </View>
              <Text style={styles.successTitle}>Review Submitted!</Text>
              <Text style={styles.successText}>
                Thank you for your valuable feedback. It helps us improve our service for everyone.
              </Text>
              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 32, width: '100%' }]}
                onPress={onClose}
              >
                <Text style={styles.submitButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNo}>Order #{order.orderNo}</Text>
                {!isReadOnly && <Text style={styles.question}>How was your experience?</Text>}
              </View>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => !isReadOnly && setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={40}
                      fill={star <= rating ? COLORS.PRIMARY : 'transparent'}
                      color={star <= rating ? COLORS.PRIMARY : COLORS.BORDER}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>{getRatingText(rating)}</Text>

              <View style={styles.tagsContainer}>
                {FEEDBACK_TAGS.map((tag) => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tag, isActive && styles.tagActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
                        {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>{isReadOnly ? 'Your Comment' : 'Share more details (Optional)'}</Text>
              <TextInput
                style={styles.input}
                placeholder={isReadOnly ? 'No comment' : 'Write your experience here...'}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                editable={!isReadOnly}
              />

              {!isReadOnly && (
                <TouchableOpacity
                  style={[styles.submitButton, (rating === 0 || loading) && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={rating === 0 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.WHITE} />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FeedbackModal;

import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Receipt, Calendar, MapPin, Package } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { resetReservation, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/ReservationSummary.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { Service } from '../../../types/reservation.types';

const ReservationSummaryScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reservation = useAppSelector((state) => state.reservation);
  
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (reservation.serviceId) {
        try {
          const data = await reservationService.getServiceById(reservation.serviceId);
          setServiceDetails(data);
        } catch (error) {
          console.error('Error fetching service details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [reservation.serviceId]);

  const calculateTotal = () => {
    if (!serviceDetails) return 0;
    const optionsTotal = reservation.selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    const deliveryFee = reservation.serviceMode === 'PICKUP_DELIVERY' ? 150 : 0;
    return serviceDetails.price + optionsTotal + deliveryFee;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        serviceId: reservation.serviceId,
        serviceMode: reservation.serviceMode,
        reservedDateTime: reservation.scheduledDate,
        pickupAddress: reservation.pickupAddress,
        deliveryAddress: reservation.deliveryAddress,
        notes: reservation.notes,
        options: reservation.selectedOptions.map(o => o.inventoryId),
        paymentMethod: 'COD', // Default for now
        deliveryFee: reservation.serviceMode === 'PICKUP_DELIVERY' ? 150 : 0,
      };

      await reservationService.createOrder(orderData);
      
      dispatch(resetReservation());
      router.push('/(protected)/(customer)/reservation/success');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper
        style={[commonStyles.safeArea, { backgroundColor: COLORS.WHITE }]}
        scroll={false}
      >
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </ScreenWrapper>
    );
  }

  const total = calculateTotal();

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[commonStyles.title, { marginBottom: 0, fontSize: 20 }]}>Order Summary</Text>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity 
        style={[commonStyles.primaryButton, submitting && { opacity: 0.7 }]} 
        onPress={handleConfirm}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <Text style={commonStyles.primaryButtonText}>Confirm and Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll
    >
      <View style={commonStyles.container}>
        <View style={styles.scrollContent}>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <Package size={20} color={COLORS.PRIMARY} />
               <Text style={styles.summaryTitle}>Service Details</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{serviceDetails?.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mode</Text>
              <Text style={styles.detailValue}>{reservation.serviceMode?.replace('_', ' ')}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <Calendar size={20} color={COLORS.PRIMARY} />
               <Text style={styles.summaryTitle}>Schedule</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{new Date(reservation.scheduledDate!).toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <MapPin size={20} color={COLORS.PRIMARY} />
               <Text style={styles.summaryTitle}>Location</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pickup</Text>
              <Text style={[styles.detailValue, { flex: 1, textAlign: 'right', marginLeft: 20 }]}>
                {reservation.pickupAddress}
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <Receipt size={20} color={COLORS.PRIMARY} />
               <Text style={styles.summaryTitle}>Bill Details</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Base Price</Text>
              <Text style={styles.detailValue}>Rs.{serviceDetails?.price.toFixed(2)}</Text>
            </View>

            <View style={styles.optionsList}>
               <Text style={[styles.detailLabel, { marginBottom: 8 }]}>Selected Options:</Text>
               {reservation.selectedOptions.map((opt, i) => (
                 <View key={i} style={styles.optionItem}>
                    <Text style={styles.optionName}>• {opt.name}</Text>
                    <Text style={styles.optionPrice}>{opt.price > 0 ? `+Rs.${opt.price.toFixed(2)}` : 'Free'}</Text>
                 </View>
               ))}
            </View>

            {reservation.serviceMode === 'PICKUP_DELIVERY' && (
              <View style={[styles.detailRow, { marginTop: 12 }]}>
                <Text style={styles.detailLabel}>Delivery Fee</Text>
                <Text style={styles.detailValue}>Rs.150.00</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>Rs.{total.toFixed(2)}</Text>
            </View>
          </View>

        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ReservationSummaryScreen;

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Info, PlusCircle, Scale, MapPin } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setServiceId, setWeightKg, setAddress, toggleOption, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/ServiceDetails.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { Service, InventoryItem } from '../../../types/reservation.types';
import { notify } from '../../../utils/notify';

const ServiceDetailsScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { preSelectedId } = useLocalSearchParams<{ preSelectedId?: string }>();
    const reservation = useAppSelector((state) => state.reservation);
    const user = useAppSelector((state) => state.auth.user);
    const { serviceId, weightKg, pickupAddress, deliveryAddress, pickupLat, pickupLng, deliveryLat, deliveryLng, serviceMode, selectedOptions } = reservation;

    const [services, setServices] = useState<Service[]>([]);
    const [options, setOptions] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [servicesData, detergentData, softenerData, finishingData] = await Promise.all([
                reservationService.getServices(),
                reservationService.getInventoryByCategory('DETERGENT'),
                reservationService.getInventoryByCategory('SOFTENER'),
                reservationService.getInventoryByCategory('FINISHING')
            ]);

            setServices(servicesData);
            setOptions([...detergentData, ...softenerData, ...finishingData]);

            if (preSelectedId && !serviceId) {
                dispatch(setServiceId(preSelectedId));
            }

            if (!pickupAddress && user?.address) {
                dispatch(setAddress({ pickup: user.address, delivery: user.address }));
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            notify.error('Error', 'Failed to load services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!pickupAddress && user?.address) {
            dispatch(setAddress({ pickup: user.address, delivery: user.address }));
        }
    }, [user?.address, pickupAddress]);

    const selectedService: Service | undefined = services.find(s => s._id === serviceId);

    const calculateTotals = () => {
        const basePrice = selectedService ? selectedService.price : 0;
        const subtotal = basePrice * (weightKg || 1);
        const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
        const deliveryFee = serviceMode === 'PICKUP_DELIVERY' ? 200 : 0;
        const total = subtotal + optionsTotal + deliveryFee;

        return { subtotal, optionsTotal, deliveryFee, total };
    };

    const totals = calculateTotals();

    const handleConfirm = async () => {
        if (!serviceId) return notify.error('Error', 'Please select a service');
        if (!weightKg || weightKg <= 0) return notify.error('Error', 'Please enter a valid weight');
        if (serviceMode === 'PICKUP_DELIVERY' && (!pickupAddress || !deliveryAddress)) {
            return notify.error('Error', 'Please provide pickup and delivery addresses');
        }

        try {
            setSubmitting(true);
            const orderData = {
                serviceId,
                serviceMode,
                weightKg,
                pickupAddress,
                deliveryAddress,
                pickupLat,
                pickupLng,
                deliveryLat,
                deliveryLng,
                options: selectedOptions.map(o => o.inventoryId),
                paymentMethod: 'NONE',
                subtotal: totals.subtotal + totals.optionsTotal,
                deliveryFee: totals.deliveryFee,
                totalAmount: totals.total,
                status: 'ORDER_PLACED',
                paymentStatus: 'PENDING',
                reservedDateTime: new Date().toISOString()
            };

            const newOrder = await reservationService.createOrder(orderData);
            router.push({
                pathname: '/(protected)/(customer)/checkout/order-summary',
                params: { orderId: newOrder._id }
            });
        } catch (error: any) {
            notify.error('Order Failed', error.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const header = (
        <AppHeader
            title="Make Reservation"
            onBackPress={() => { dispatch(prevStep()); router.back(); }}
        />
    );

    const footer = (
        <View style={commonStyles.footer}>
            <TouchableOpacity
                style={[commonStyles.primaryButton, (!serviceId || submitting) && { opacity: 0.5 }]}
                onPress={handleConfirm}
                disabled={!serviceId || submitting}
            >
                {submitting ? (
                    <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                    <Text style={commonStyles.primaryButtonText}>Place Order • Rs.{(totals.total || 0).toFixed(2)}</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    if (loading) return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Configuring your service...</Text>
        </View>
    );

    return (
        <ScreenWrapper header={header} footer={footer} scroll>
            <View style={commonStyles.container}>
                <Text style={commonStyles.title}>Service Details</Text>
                <Text style={commonStyles.subtitle}>Customize your laundry service requirements.</Text>

                <View style={commonStyles.content}>
                    {/* 1. Main Service Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Service</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
                            {services.map((item) => {
                                const isSelected = serviceId === item._id;
                                return (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={[styles.serviceCard, { width: 160, marginRight: 12 }, isSelected && styles.serviceCardActive]}
                                        onPress={() => dispatch(setServiceId(item._id))}
                                    >
                                        <Text style={[styles.serviceName, isSelected && styles.serviceNameActive]} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.servicePrice}>Rs.{item.price}/{item.unit?.toLowerCase() || 'kg'}</Text>
                                        {isSelected && (
                                            <View style={styles.selectedBadge}><View style={styles.selectedDot} /></View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* 2. Weight Input */}
                    <View style={styles.section}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Scale size={20} color={COLORS.PRIMARY} />
                            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Est. {selectedService?.unit || 'Weight'}</Text>
                        </View>
                        <View style={styles.weightInputContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder={`Enter ${selectedService?.unit || 'quantity'}`}
                                keyboardType="numeric"
                                value={weightKg?.toString()}
                                onChangeText={(val) => dispatch(setWeightKg(Number(val)))}
                            />
                            <View style={styles.unitBadge}>
                                <Text style={styles.unitText}>{selectedService?.unit || 'UNIT'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3. Address Selection (Conditional) */}
                    {serviceMode === 'PICKUP_DELIVERY' && (
                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <MapPin size={20} color={COLORS.PRIMARY} />
                                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Collection & Return</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.input, { justifyContent: 'center', height: 'auto', minHeight: 60, paddingVertical: 12, marginBottom: 12 }]}
                                onPress={() => router.push('/(protected)/(customer)/reservation/address')}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, color: COLORS.TEXT_MUTED, fontWeight: '600' }}>Pickup Location</Text>
                                        <Text style={{ fontSize: 15, color: pickupAddress ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED, marginTop: 4 }}>
                                            {pickupAddress || 'Tap to select on map'}
                                        </Text>
                                    </View>
                                    <ChevronLeft size={20} color={COLORS.TEXT_MUTED} style={{ transform: [{ rotate: '180deg' }] }} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.input, { justifyContent: 'center', height: 'auto', minHeight: 60, paddingVertical: 12 }]}
                                onPress={() => router.push('/(protected)/(customer)/reservation/address')}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, color: COLORS.TEXT_MUTED, fontWeight: '600' }}>Delivery Location</Text>
                                        <Text style={{ fontSize: 15, color: deliveryAddress ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED, marginTop: 4 }}>
                                            {deliveryAddress || 'Tap to select on map'}
                                        </Text>
                                    </View>
                                    <ChevronLeft size={20} color={COLORS.TEXT_MUTED} style={{ transform: [{ rotate: '180deg' }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* 4. Additional Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {options.map((item) => {
                                const isSelected = selectedOptions.some(o => o.inventoryId === item._id);
                                return (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={[styles.optionChip, isSelected && styles.optionChipActive]}
                                        onPress={() => dispatch(toggleOption({
                                            inventoryId: item._id,
                                            name: item.name,
                                            price: item.unitPrice,
                                            categoryName: item.categoryName
                                        }))}
                                    >
                                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item.name}</Text>
                                        {isSelected && <Text style={styles.chipTextActive}>+Rs.{item.unitPrice}</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* 5. Add-ons Button */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.addOnsButton}
                            onPress={() => router.push('/(protected)/(customer)/reservation/add-ons')}
                        >
                            <PlusCircle size={20} color={COLORS.PRIMARY} />
                            <Text style={styles.addOnsText}>Select Extra Add-ons</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 6. Price Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Price Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Base Service ({weightKg || 1}{selectedService?.unit?.toLowerCase() || 'kg'})</Text>
                            <Text style={styles.summaryValue}>Rs.{(totals.subtotal || 0).toFixed(2)}</Text>
                        </View>
                        {selectedOptions.length > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Additional Options ({selectedOptions.length})</Text>
                                <Text style={styles.summaryValue}>Rs.{(totals.optionsTotal || 0).toFixed(2)}</Text>
                            </View>
                        )}
                        {totals.deliveryFee > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                <Text style={styles.summaryValue}>Rs.{(totals.deliveryFee || 0).toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Estimate</Text>
                            <Text style={styles.totalValue}>Rs.{(totals.total || 0).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ServiceDetailsScreen;

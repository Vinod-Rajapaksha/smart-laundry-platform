import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Truck, ShoppingBag, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setServiceMode, nextStep, resetReservation } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/ServiceMode.styles';

const ServiceModeScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { serviceMode } = useAppSelector((state) => state.reservation);

    useEffect(() => {
        dispatch(resetReservation());
    }, []);

    const handleSelectMode = (mode: 'PICKUP_DELIVERY' | 'SELF_SERVICE') => {
        dispatch(setServiceMode(mode));
        dispatch(nextStep());
        router.push('/(protected)/(customer)/reservation/service-details');
    };

    const footer = (
        <View style={[commonStyles.footer, { backgroundColor: 'transparent', borderTopWidth: 0 }]}>
            <Text style={styles.footerNote}>Prices may vary based on your location and selected service.</Text>
        </View>
    );

    return (
        <ScreenWrapper
            header={<AppHeader title="Make Reservation" />}
            footer={footer}
            scroll
        >
            <View style={commonStyles.container}>


                <Text style={commonStyles.title}>How would you like to receive our service?</Text>
                <Text style={commonStyles.subtitle}>
                    Choose the most convenient way for us to handle your laundry.
                </Text>

                <View style={commonStyles.content}>
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            serviceMode === 'PICKUP_DELIVERY' && styles.optionCardActive
                        ]}
                        onPress={() => handleSelectMode('PICKUP_DELIVERY')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                            <Truck size={28} color={COLORS.PRIMARY} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={[styles.cardTitle, serviceMode === 'PICKUP_DELIVERY' && { color: COLORS.PRIMARY }]}>
                                Pickup & Delivery
                            </Text>
                            <Text style={styles.cardDescription}>We pick up from your doorstep and deliver it back fresh.</Text>
                        </View>
                        {serviceMode === 'PICKUP_DELIVERY' ? (
                            <CheckCircle2 size={24} color={COLORS.PRIMARY} />
                        ) : (
                            <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            serviceMode === 'SELF_SERVICE' && styles.optionCardActive
                        ]}
                        onPress={() => handleSelectMode('SELF_SERVICE')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                            <ShoppingBag size={28} color={COLORS.SUCCESS} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={[styles.cardTitle, serviceMode === 'SELF_SERVICE' && { color: COLORS.SUCCESS }]}>
                                Self Service (Drop-off)
                            </Text>
                            <Text style={styles.cardDescription}>Drop off your laundry at our shop and pick up when ready.</Text>
                        </View>
                        {serviceMode === 'SELF_SERVICE' ? (
                            <CheckCircle2 size={24} color={COLORS.SUCCESS} />
                        ) : (
                            <ChevronRight size={20} color={COLORS.TEXT_MUTED} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ServiceModeScreen;

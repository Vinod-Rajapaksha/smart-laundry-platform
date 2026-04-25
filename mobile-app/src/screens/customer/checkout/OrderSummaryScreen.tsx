import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ticket, ChevronRight, WashingMachine, ArrowRight, Scale, MapPin, CheckCircle2, XCircle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Checkout.styles';
import { orderService } from '../../../services/customer/orderService';
import { voucherService } from '../../../services/customer/voucherService';
import { Order } from '../../../types/order.types';

const OrderSummaryScreen = () => {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [voucherCode, setVoucherCode] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [showVoucherInput, setShowVoucherInput] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderById(orderId as string);
            setOrder(data);
            if (data.voucherId) {
            }
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            Alert.alert('Error', 'Failed to load order summary');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyVoucher = async () => {
        if (!order || !voucherCode.trim()) return;

        try {
            setIsApplyingVoucher(true);
            await voucherService.applyVoucherToOrder(order._id, voucherCode.trim());

            await fetchOrderDetails();

            setVoucherCode('');
            setShowVoucherInput(false);
            Alert.alert('Success', 'Voucher applied successfully!');
        } catch (error: any) {
            Alert.alert('Voucher Error', error.message || 'Invalid voucher code');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    if (loading && !order) return <Loading fullScreen message="Finalizing your summary..." />;
    if (!order) return null;

    const subtotal = order.subtotal || 0;
    const deliveryFee = order.deliveryFee || 0;
    const discount = order.discountTotal || 0;
    const totalAmount = order.totalAmount || 0;

    return (
        <ScreenWrapper
            header={<AppHeader title="Order Summary" />}
            footer={
                <View style={styles.footer}>
                    <Button
                        title="Continue to Payment"
                        rightIcon={<ArrowRight color={COLORS.WHITE} size={20} />}
                        onPress={() => router.push({
                            pathname: '/(protected)/(customer)/checkout/payment-method',
                            params: { orderId: order._id, total: totalAmount }
                        })}
                        size="lg"
                    />
                </View>
            }
            scroll
        >
            <View style={styles.content}>
                {/* Vendor Header */}
                <View style={styles.orderHeader}>
                    <View style={styles.serviceIcon}>
                        <WashingMachine color={COLORS.PRIMARY} size={24} />
                    </View>
                    <View>
                        <Text style={styles.vendorName}>B & W Laundry</Text>
                        <Text style={styles.vendorSubtitle}>Professional Care • {order.serviceMode?.replace('_', ' ') || ''}</Text>
                    </View>
                </View>

                {/* Main Service Card */}
                <View style={styles.card}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Service</Text>
                            <Text style={styles.detailValue}>{order.serviceId?.name || 'Standard Wash'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Weight</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Scale size={14} color={COLORS.TEXT_SECONDARY} />
                                <Text style={styles.detailValue}>{order.weightKg || '--'} KG</Text>
                            </View>
                        </View>
                    </View>

                    {order.serviceMode === 'PICKUP_DELIVERY' && (
                        <View style={[styles.detailRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <MapPin size={14} color={COLORS.PRIMARY} />
                                    <Text style={styles.detailLabel}>Address</Text>
                                </View>
                                <Text style={[styles.detailValue, { fontSize: 13 }]} numberOfLines={2}>
                                    {order.pickupAddress}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Additional Options & Add-ons */}
                {order.options && order.options.length > 0 && (
                    <View style={[styles.card, { paddingBottom: 12 }]}>
                        <Text style={[styles.detailLabel, { marginBottom: 16 }]}>Additional Options</Text>
                        {order.options.map((opt, idx) => (
                            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 size={16} color={COLORS.PRIMARY} />
                                    <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY, fontWeight: '500' }}>{opt.name}</Text>
                                </View>
                                <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>Rs.{(opt.price || 0).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Voucher Section */}
                <View style={[styles.card, { padding: 16 }]}>
                    {order.voucherId ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <Ticket color={COLORS.SUCCESS} size={24} />
                                <View>
                                    <Text style={{ color: COLORS.SUCCESS, fontWeight: '600', fontSize: 13 }}>Voucher Applied</Text>
                                    <Text style={{ color: COLORS.TEXT_PRIMARY, fontWeight: '700' }}>Save Rs.{order.discountTotal?.toFixed(2)}</Text>
                                </View>
                            </View>
                            <CheckCircle2 color={COLORS.SUCCESS} size={24} />
                        </View>
                    ) : !showVoucherInput ? (
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => router.push({
                                pathname: '/(protected)/(customer)/vouchers/available',
                                params: { orderId: order._id, total: (order.subtotal + order.extraFee) }
                            })}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <Ticket color={COLORS.PRIMARY} size={24} />
                                <Text style={{ color: COLORS.TEXT_PRIMARY, fontWeight: '500' }}>Apply Voucher Code</Text>
                            </View>
                            <ChevronRight color={COLORS.TEXT_MUTED} size={20} />
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <Ticket color={COLORS.PRIMARY} size={20} />
                                <Text style={{ fontWeight: '600' }}>Enter Voucher Code</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        borderColor: COLORS.BORDER,
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        backgroundColor: '#F8FAFC'
                                    }}
                                    placeholder="e.g. LAUNDRY20"
                                    autoCapitalize="characters"
                                    value={voucherCode}
                                    onChangeText={setVoucherCode}
                                />
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.PRIMARY,
                                        paddingHorizontal: 16,
                                        borderRadius: 8,
                                        justifyContent: 'center',
                                        opacity: isApplyingVoucher || !voucherCode ? 0.6 : 1
                                    }}
                                    onPress={handleApplyVoucher}
                                    disabled={isApplyingVoucher || !voucherCode}
                                >
                                    {isApplyingVoucher ? (
                                        <ActivityIndicator size="small" color={COLORS.WHITE} />
                                    ) : (
                                        <Text style={{ color: COLORS.WHITE, fontWeight: '700' }}>Apply</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {!order.voucherId && !showVoucherInput && (
                        <TouchableOpacity
                            style={{ marginTop: 12, paddingVertical: 8, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9' }}
                            onPress={() => setShowVoucherInput(true)}
                        >
                            <Text style={{ color: COLORS.PRIMARY, fontSize: 13, fontWeight: '600' }}>I have a specific code</Text>
                        </TouchableOpacity>
                    )}

                    {showVoucherInput && (
                        <TouchableOpacity
                            style={{ marginTop: 12, alignItems: 'center' }}
                            onPress={() => setShowVoucherInput(false)}
                        >
                            <Text style={{ color: COLORS.TEXT_MUTED, fontSize: 13 }}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Price Breakdown */}
                <View style={[styles.priceBreakdown, { marginTop: 8 }]}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Base Subtotal</Text>
                        <Text style={styles.priceValue}>Rs {(subtotal || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Additional Options</Text>
                        <Text style={styles.priceValue}>Rs {(order.extraFee || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Delivery Fee</Text>
                        <Text style={styles.priceValue}>{deliveryFee > 0 ? `Rs ${(deliveryFee || 0).toFixed(2)}` : 'FREE'}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, { color: COLORS.SUCCESS_TEXT }]}>Voucher Discount</Text>
                            <Text style={[styles.priceValue, { color: COLORS.SUCCESS_TEXT }]}>-Rs {(discount || 0).toFixed(2)}</Text>
                        </View>
                    )}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>Rs {(totalAmount || 0).toFixed(2)}</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </View>
        </ScreenWrapper>
    );
};

export default OrderSummaryScreen;

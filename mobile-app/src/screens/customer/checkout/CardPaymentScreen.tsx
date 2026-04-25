import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import { paymentService } from '../../../services/customer/paymentService';
import { Switch } from 'react-native';

type PaymentMode = 'SELECT_CARD' | 'NEW_CARD_WEBVIEW' | 'CHARGING_SAVED';

const CardPaymentScreen = () => {
    const router = useRouter();
    const { orderId, total } = useLocalSearchParams();
    const [mode, setMode] = useState<PaymentMode>('SELECT_CARD');
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [payhereParams, setPayhereParams] = useState<any>(null);
    const [charging, setCharging] = useState(false);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const [saveCard, setSaveCard] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    const loadData = async () => {
        try {
            const cards = await paymentService.getSavedCards();
            setSavedCards(cards);
            if (cards.length > 0) {
                const defaultCard = cards.find((c: any) => c.isDefault) || cards[0];
                setSelectedCard(defaultCard._id);
            } else {
            }
        } catch (error) {
            console.error('Failed to load saved cards', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayWithSavedCard = async () => {
        if (!selectedCard) return;
        setCharging(true);
        setMode('CHARGING_SAVED');
        try {
            await paymentService.chargeSavedCard(orderId as string, selectedCard);
            router.replace({
                pathname: '/(protected)/(customer)/checkout/payment-status',
                params: { success: 'true', orderId, method: 'CARD', total }
            });
        } catch (error: any) {
            Alert.alert('Payment Failed', error.message || 'Error charging saved card');
            setMode('SELECT_CARD');
            setCharging(false);
        }
    };

    const handleNewCard = async () => {
        setLoading(true);
        try {
            const data = await paymentService.initCardPayment(orderId as string, saveCard);
            setPayhereParams(data.payhereParams);
            setMode('NEW_CARD_WEBVIEW');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    const generateFormHTML = () => {
        if (!payhereParams) return '';
        return `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="post" action="https://sandbox.payhere.lk/pay/checkout">
            ${Object.keys(payhereParams).map(key =>
            `<input type="hidden" name="${key}" value="${payhereParams[key]}"/>`
        ).join('')}
          </form>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f8fafc;">
            <div style="text-align: center;">
              <h2 style="color: #64748b;">Secure Checkout</h2>
              <p style="color: #94a3b8;">Redirecting to PayHere...</p>
            </div>
          </div>
        </body>
      </html>
    `;
    };

    const handleNavigationChange = (navState: WebViewNavigation) => {
        const { url } = navState;
        if (url.includes('payment/success') || url.includes('/success')) {
            router.replace({
                pathname: '/(protected)/(customer)/checkout/payment-status',
                params: { success: 'true', orderId, method: 'CARD', total }
            });
        } else if (url.includes('payment/cancel') || url.includes('/cancel')) {
            Alert.alert('Payment Cancelled', 'Your payment was not completed.');
            setMode('SELECT_CARD');
        }
    };

    const renderCardItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[
                styles.cardItem,
                selectedCard === item._id && styles.selectedCardItem
            ]}
            onPress={() => setSelectedCard(selectedCard === item._id ? null : item._id)}
        >
            <View style={styles.cardInfo}>
                <View style={[styles.cardIconContainer, { backgroundColor: getCardColor(item.brand) }]}>
                    <Ionicons
                        name={item.brand.toLowerCase() === 'visa' ? 'card' : 'card-outline'}
                        size={24}
                        color={COLORS.WHITE}
                    />
                </View>
                <View style={styles.cardDetails}>
                    <Text style={styles.cardBrand}>{item.brand} •••• {item.last4}</Text>
                    <Text style={styles.cardExpiry}>Expires {item.expiryMonth}/{item.expiryYear}</Text>
                </View>
            </View>
            {selectedCard === item._id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.PRIMARY} />
            )}
        </TouchableOpacity>
    );

    const getCardColor = (brand: string) => {
        switch (brand.toLowerCase()) {
            case 'visa': return '#1a1f71';
            case 'mastercard': return '#eb001b';
            case 'amex': return '#007bc1';
            default: return COLORS.PRIMARY;
        }
    };

    if (loading && mode === 'SELECT_CARD') return <Loading fullScreen message="Loading saved cards..." />;

    return (
        <ScreenWrapper
            header={<AppHeader title="Secure Payment" />}
            style={{ backgroundColor: '#F8FAFC' }}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                {mode === 'SELECT_CARD' && (
                    <View style={styles.content}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Amount Due</Text>
                            <Text style={styles.summaryAmount}>Rs. {total}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Select a Card</Text>

                        {savedCards.length > 0 ? (
                            <FlatList
                                data={savedCards}
                                renderItem={renderCardItem}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.cardList}
                                scrollEnabled={false}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="card-outline" size={48} color={COLORS.TEXT_MUTED} />
                                <Text style={styles.emptyText}>No saved cards found</Text>
                            </View>
                        )}
                        {!selectedCard && (
                            <View style={styles.saveCardContainer}>
                                <View style={styles.saveCardInfo}>
                                    <Ionicons name="save-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                                    <Text style={styles.saveCardText}>Save card for future payments</Text>
                                </View>
                                <Switch
                                    value={saveCard}
                                    onValueChange={setSaveCard}
                                    trackColor={{ false: '#CBD5E1', true: COLORS.PRIMARY_LIGHT }}
                                    thumbColor={saveCard ? COLORS.PRIMARY : '#F1F5F9'}
                                />
                            </View>
                        )}

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.payButton}
                                onPress={() => selectedCard ? handlePayWithSavedCard() : handleNewCard()}
                            >
                                <Text style={styles.payButtonText}>Pay Rs. {total}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {mode === 'NEW_CARD_WEBVIEW' && (
                    <View style={{ flex: 1 }}>
                        <WebView
                            ref={webViewRef}
                            source={{ html: generateFormHTML() }}
                            onNavigationStateChange={handleNavigationChange}
                            onLoadStart={() => setWebViewLoading(true)}
                            onLoadEnd={() => setWebViewLoading(false)}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            style={styles.webview}
                        />
                        {webViewLoading && (
                            <View style={styles.webviewLoader}>
                                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                                <Text style={styles.loaderText}>Securely loading gateway...</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.cancelWebView}
                            onPress={() => setMode('SELECT_CARD')}
                        >
                            <Text style={styles.cancelWebViewText}>Cancel and choose saved card</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {mode === 'CHARGING_SAVED' && (
                    <View style={styles.chargingContainer}>
                        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                        <Text style={styles.chargingTitle}>Processing Payment</Text>
                        <Text style={styles.chargingSubtitle}>Securely charging your card...</Text>
                    </View>
                )}
            </Animated.View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    summaryCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        marginBottom: 8,
        fontWeight: '500',
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.PRIMARY,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 16,
    },
    cardList: {
        marginBottom: 16,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    selectedCardItem: {
        borderColor: COLORS.PRIMARY,
        backgroundColor: COLORS.WHITE,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconContainer: {
        width: 48,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardDetails: {
        justifyContent: 'center',
    },
    cardBrand: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    cardExpiry: {
        fontSize: 12,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        color: COLORS.TEXT_MUTED,
        fontSize: 14,
    },
    newCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
        borderStyle: 'dashed',
    },
    newCardText: {
        marginLeft: 8,
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
    },
    payButton: {
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.TEXT_MUTED,
    },
    payButtonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: '700',
    },
    webview: {
        flex: 1,
    },
    webviewLoader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        color: COLORS.TEXT_SECONDARY,
        fontSize: 14,
    },
    cancelWebView: {
        padding: 16,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: '#EEF2F6',
    },
    cancelWebViewText: {
        color: COLORS.ERROR,
        fontWeight: '500',
    },
    chargingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: COLORS.WHITE,
    },
    chargingTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginTop: 16,
    },
    chargingSubtitle: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 8,
        textAlign: 'center',
    },
    saveCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginTop: 8,
        marginHorizontal: 4,
    },
    saveCardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    saveCardText: {
        fontSize: 14,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    }
});

export default CardPaymentScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import api from '../../../services/api';

const AddCardScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const [params, setParams] = useState<any>(null);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        initPreApproval();
    }, []);

    const initPreApproval = async () => {
        try {
            const tempOrderId = `ADD_CARD_${Date.now()}`;
            const response = await api.get(`/payments/online/payhere/pre-approval/hash/${tempOrderId}`);
            if (response.data.success) {
                setParams(response.data.data);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to initialize secure gateway');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const generateFormHTML = () => {
        if (!params) return '';
        // PayHere Pre-approval requires specific fields
        return `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="post" action="https://sandbox.payhere.lk/pay/preapprove">
            <input type="hidden" name="merchant_id" value="${params.merchantId}"/>
            <input type="hidden" name="return_url" value="http://sample.com/payment/success"/>
            <input type="hidden" name="cancel_url" value="http://sample.com/payment/cancel"/>
            <input type="hidden" name="notify_url" value="https://your-backend.com/api/payments/online/payhere/notify"/>
            <input type="hidden" name="order_id" value="${params.orderId}"/>
            <input type="hidden" name="items" value="Card Verification"/>
            <input type="hidden" name="currency" value="${params.currency}"/>
            <input type="hidden" name="amount" value="${params.amount}"/>
            <input type="hidden" name="first_name" value="${params.customer.firstName}"/>
            <input type="hidden" name="last_name" value="${params.customer.lastName}"/>
            <input type="hidden" name="email" value="${params.customer.email}"/>
            <input type="hidden" name="phone" value="${params.customer.phone}"/>
            <input type="hidden" name="address" value="No 123, Street"/>
            <input type="hidden" name="city" value="Colombo"/>
            <input type="hidden" name="country" value="Sri Lanka"/>
            <input type="hidden" name="hash" value="${params.hash}"/>
          </form>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, sans-serif; background-color: #F8FAFC;">
            <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center;">
              <h2 style="color: #1E293B; margin-bottom: 0.5rem;">Secure Verification</h2>
              <p style="color: #64748B;">Connecting to PayHere Security Gateway...</p>
              <div style="margin-top: 2rem; border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; display: inline-block;"></div>
            </div>
          </div>
          <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </body>
      </html>
    `;
    };

    const handleNavigationChange = (navState: WebViewNavigation) => {
        const { url } = navState;
        if (url.includes('payment/success') || url.includes('/success')) {
            Alert.alert('Success', 'Card added and verified successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else if (url.includes('payment/cancel') || url.includes('/cancel')) {
            router.back();
        }
    };

    const header = (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Card</Text>
        </View>
    );

    if (loading) return <Loading fullScreen message="Preparing secure gateway..." />;

    return (
        <ScreenWrapper
            header={header}
            style={{ backgroundColor: COLORS.WHITE }}
        >
            <View style={styles.container}>
                <View style={styles.infoBanner}>
                    <ShieldCheck size={20} color={COLORS.SUCCESS} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoTitle}>Secure Tokenization</Text>
                        <Text style={styles.infoText}>We use PayHere to securely store your card. A small refundable amount might be charged for verification.</Text>
                    </View>
                </View>

                <View style={styles.webViewContainer}>
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
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                            <Text style={styles.loaderText}>Securely loading gateway...</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Lock size={16} color={COLORS.TEXT_LIGHT} />
                    <Text style={styles.footerText}>PCI-DSS Level 1 Compliant Security</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.TEXT_PRIMARY,
    },
    infoBanner: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#F0FDF4',
        borderBottomWidth: 1,
        borderBottomColor: '#DCFCE7',
        gap: 12,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#166534',
    },
    infoText: {
        fontSize: 12,
        color: '#166534',
        marginTop: 2,
    },
    webViewContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        color: COLORS.TEXT_SECONDARY,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 8,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.TEXT_LIGHT,
        fontWeight: '500',
    }
});

export default AddCardScreen;

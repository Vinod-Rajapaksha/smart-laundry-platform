import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, WashingMachine, Save, Share2, Download, PackageOpen } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import { useEffect, useState, useRef } from 'react';
import { orderService } from '../../../services/customer/orderService';
import { Order } from '../../../types/order.types';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Screen displaying a QR code for order verification.
 * Matches the requested premium design with Save and Download functionality.
 */
const OrderQrCodeScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const data = await orderService.getOrderById(orderId as string);
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order for QR:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `B&W Laundry Order QR Code for Order #${order?.orderNo || order?._id.substring(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveQrToGallery = async () => {
    if (!qrRef.current) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to save images to your gallery.');
        return;
      }

      qrRef.current.toDataURL(async (dataURL: string) => {
        const fileUri = `${FileSystem.cacheDirectory}order-qr-${order?._id}.png`;
        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await MediaLibrary.saveToLibraryAsync(fileUri);
        Alert.alert('Success', 'QR Code saved to gallery!');
      });
    } catch (error) {
      console.error('Error saving QR:', error);
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  const downloadReceipt = async () => {
    if (!order) return;
    setIsDownloading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const filename = `receipt-${order.orderNo || order._id}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        orderService.getReceiptUrl(order._id),
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        setIsDownloading(false);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert('Success', 'Receipt downloaded to your device!');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download receipt');
    } finally {
      setIsDownloading(false);
    }
  };

  const header = (
    <View style={qrStyles.header}>
      <TouchableOpacity onPress={() => router.back()} style={qrStyles.backIcon}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={qrStyles.headerTitle}>Order QR Code</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  if (loading) return <Loading fullScreen />;
  if (!order) return null;

  const orderNumber = order.orderNo || order._id.substring(0, 8).toUpperCase();

  return (
    <ScreenWrapper
      style={{ backgroundColor: '#F8FAFC' }}
      header={header}
      scroll
    >
      <View style={qrStyles.container}>
        {/* Branding Section */}
        <View style={qrStyles.branding}>
          <View style={qrStyles.logoCircle}>
            <WashingMachine size={32} color={COLORS.PRIMARY} />
          </View>
          <Text style={qrStyles.brandName}>B & W Laundry</Text>
          <Text style={qrStyles.brandStatus}>Order processed successfully</Text>
        </View>

        {/* QR Card */}
        <View style={qrStyles.qrCard}>
          <View style={qrStyles.qrOutline}>
            <QRCode
              value={order._id}
              size={180}
              color={COLORS.TEXT_PRIMARY}
              backgroundColor="transparent"
              getRef={(ref) => (qrRef.current = ref)}
            />
          </View>
          
          <View style={qrStyles.idSection}>
            <Text style={qrStyles.idLabel}>ORDER ID</Text>
            <Text style={qrStyles.idValue}>#{orderNumber}</Text>
          </View>
        </View>

        {/* Info Text */}
        <Text style={qrStyles.infoText}>
          Show this QR code to the delivery agent at pickup to confirm your identity and secure your items.
        </Text>

        {/* Actions */}
        <View style={qrStyles.actionContainer}>
          <TouchableOpacity 
            style={qrStyles.primaryButton}
            onPress={() => router.replace({
              pathname: '/(protected)/(customer)/orders/tracking',
              params: { orderId: order._id }
            })}
          >
            <PackageOpen size={20} color={COLORS.WHITE} />
            <Text style={qrStyles.primaryButtonText}>Track your Order</Text>
          </TouchableOpacity>

          <View style={qrStyles.secondaryRow}>
            <TouchableOpacity 
              style={qrStyles.secondaryButton}
              onPress={saveQrToGallery}
            >
              <Save size={18} color={COLORS.WHITE} />
              <Text style={qrStyles.secondaryButtonText}>Save QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={qrStyles.greyButton} onPress={onShare}>
              <Share2 size={18} color={COLORS.PRIMARY} />
              <Text style={qrStyles.greyButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[qrStyles.navyButton, isDownloading && { opacity: 0.7 }]}
            onPress={downloadReceipt}
            disabled={isDownloading}
          >
            <Download size={18} color={COLORS.WHITE} />
            <Text style={qrStyles.navyButtonText}>
              {isDownloading ? 'Downloading...' : 'Download Receipt'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const qrStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  backIcon: {
    padding: 5,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  branding: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  brandStatus: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  qrCard: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  qrOutline: {
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_LIGHT,
    borderStyle: 'dashed',
    borderRadius: 24,
    marginBottom: 20,
  },
  idSection: {
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  idValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.BLACK,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#084CB3', 
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryButtonText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
  greyButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  greyButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
  navyButton: {
    backgroundColor: '#0F172A',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  navyButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderQrCodeScreen;

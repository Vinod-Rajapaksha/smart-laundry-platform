import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Copy,
  Info,
  UploadCloud,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import styles from './styles/Checkout.styles';
import { paymentService } from '../../../services/customer/paymentService';

const BankTransferScreen = () => {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams();
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slipImage, setSlipImage] = useState<string | null>(null);

  useEffect(() => {
    initPayment();
  }, []);

  const initPayment = async () => {
    try {
      const data = await paymentService.initBankTransfer(orderId as string);
      setBankInfo(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSlipImage(result.assets[0].uri);
    }
  };

  const handleConfirm = async () => {
    if (!slipImage) {
      Alert.alert('Missing Info', 'Please upload your payment transfer slip.');
      return;
    }

    setLoading(true);
    try {
      await paymentService.submitBankTransfer(
        orderId as string,
        bankInfo?.bank?.bankName,
        bankInfo?.bank?.reference,
        bankInfo?.bank?.accountNo,
        slipImage
      );

      router.push({
        pathname: '/(protected)/(customer)/checkout/payment-status',
        params: { success: 'true', orderId, method: 'BANK_TRANSFER', total }
      });
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message || 'Something went wrong while submitting your transfer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bankInfo) return <Loading fullScreen />;

  return (
    <ScreenWrapper
      header={<AppHeader title="Bank Transfer" />}
      footer={
        <View style={styles.footer}>
          <Button
            title="Confirm Payment"
            onPress={handleConfirm}
            size="lg"
            loading={loading}
          />
        </View>
      }
      scroll
    >
      <View style={styles.content}>
        {/* Order Reference */}
        <View style={styles.card}>
          <Text style={styles.detailLabel}>Order Reference</Text>
          <View style={[styles.bankDetailBox, { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.PRIMARY_SOFT }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>Transaction ID</Text>
              <Text style={{ fontSize: 16, fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD, color: COLORS.TEXT_PRIMARY }}>
                {bankInfo?.bank?.reference}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopy(bankInfo?.bank?.reference, 'Transaction ID')}
            >
              <Copy size={16} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.card, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
          <View style={{ flexDirection: 'row' }}>
            <Info size={20} color={COLORS.PRIMARY} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD, color: COLORS.TEXT_PRIMARY }}>Payment Instructions</Text>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY, marginTop: 4, lineHeight: 18 }}>
                Please ensure you transfer the <Text style={{ fontWeight: 'bold' }}>exact amount</Text> and include the Reference ID above in your transfer <Text style={{ fontWeight: 'bold' }}>remark</Text> to avoid delays.
              </Text>
            </View>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.card}>
          <Text style={[styles.detailLabel, { marginBottom: 12 }]}>Bank Details</Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.detailLabel}>Bank Name</Text>
            <Text style={styles.detailValue}>{bankInfo?.bank?.bankName || 'Commercial Bank'}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.detailLabel}>Account Name</Text>
            <Text style={styles.detailValue}>{bankInfo?.bank?.accountName || 'B & W Laundry Services Ltd.'}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <View style={[styles.bankDetailBox, { marginTop: 4 }]}>
              <Text style={{ fontSize: 18, fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD }}>{bankInfo?.bank?.accountNo}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(bankInfo?.bank?.accountNo, 'Account Number')}
              >
                <Copy size={16} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.detailLabel}>Branch</Text>
            <Text style={styles.detailValue}>{bankInfo?.bank?.branch || 'Kottawa'}</Text>
          </View>
        </View>

        {/* Upload Area */}
        <View style={{ marginBottom: 32 }}>
          <Text style={[styles.detailLabel, { marginBottom: 12 }]}>Upload Transfer Slip</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            {slipImage ? (
              <Image source={{ uri: slipImage }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
            ) : (
              <>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
                  <UploadCloud size={32} color={COLORS.TEXT_MUTED} />
                </View>
                <Text style={styles.uploadTitle}>Click to upload or drag and drop</Text>
                <Text style={styles.uploadDesc}>PDF, JPG, or PNG (Max. 5MB)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScreenWrapper>
  );
};

export default BankTransferScreen;
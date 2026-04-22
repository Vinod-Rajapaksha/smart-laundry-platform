import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Hash, X, ImageIcon } from 'lucide-react-native';
import Input from '../../../components/common/Input';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { scanService } from '../../../services/staff/scanService';

const ManualEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(params.attachedImage as string || null);

  const handleManualSearch = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Please enter a valid Order Number');
      return;
    }

    try {
      setLoading(true);
      const result = await scanService.validateQrCode(orderId);

      router.push({
        pathname: '/(protected)/(staff)/scan/result',
        params: { 
          resultRaw: JSON.stringify(result),
          conditionImage: attachedImage || ''
        }
      });

    } catch (error: any) {
      Alert.alert('Search Failed', error.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <View style={s.header}>
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={s.headerTitle}>Order Verification</Text>
      <View style={{ width: 44 }} />
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <View style={s.container}>
        
        {attachedImage && (
          <View style={s.imagePreviewCard}>
            <View style={s.cardHeader}>
              <View style={s.badge}>
                <ImageIcon size={14} color={COLORS.WHITE} />
                <Text style={s.badgeText}>SELECTED QR IMAGE</Text>
              </View>
              <TouchableOpacity onPress={() => setAttachedImage(null)}>
                <X size={20} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: attachedImage }} style={s.previewImage} resizeMode="contain" />
            <Text style={s.imageHint}>Enter the ID shown in the QR details below</Text>
          </View>
        )}

        {!attachedImage && (
          <Text style={s.description}>
            If the QR code is damaged or unscanable, please enter the unique Order Number provided below the QR image.
          </Text>
        )}

        <View style={s.inputWrapper}>
          <Text style={s.inputLabel}>Order Number Information</Text>
          <Input
            placeholder="e.g. #BW-1234..."
            value={orderId}
            onChangeText={setOrderId}
            autoCapitalize="characters"
            leftIcon={<Hash size={20} color={COLORS.PRIMARY} />}
          />
        </View>

        <TouchableOpacity
          style={[s.searchBtn, loading && s.btnDisabled]}
          onPress={handleManualSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={s.searchBtnText}>Search & Verify Order</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
};

const s = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  container: {
    padding: 24,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 32,
  },
  imagePreviewCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D47A1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '800',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  imageHint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: '#0D47A1',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  searchBtnText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
  }
});

export default ManualEntryScreen;
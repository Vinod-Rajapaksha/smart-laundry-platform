import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Hash } from 'lucide-react-native';
import Input from '../../../components/common/Input';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { scanService } from '../../../services/staff/scanService';

const ManualEntryScreen = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSearch = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Please enter a valid Order ID');
      return;
    }

    try {
      setLoading(true);
      const result = await scanService.validateQrCode(orderId);

      router.push({
        pathname: '/(protected)/(staff)/scan/result',
        params: { resultRaw: JSON.stringify(result) }
      });

    } catch (error: any) {
      Alert.alert('Search Failed', error.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Manual Entry</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, marginBottom: 32 }}>
          If the QR code is damaged or unscanable, please enter the unique Order ID provided below the QR image.
        </Text>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginBottom: 8 }}>Order ID</Text>
          <Input
            placeholder="e.g. 661d..."
            value={orderId}
            onChangeText={setOrderId}
            autoCapitalize="none"
            leftIcon={<Hash size={20} color={COLORS.TEXT_SECONDARY} />}
          />
        </View>

        <TouchableOpacity
          style={[
            { backgroundColor: COLORS.PRIMARY, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
            loading && { backgroundColor: '#CBD5E1' }
          ]}
          onPress={handleManualSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Search Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ManualEntryScreen;
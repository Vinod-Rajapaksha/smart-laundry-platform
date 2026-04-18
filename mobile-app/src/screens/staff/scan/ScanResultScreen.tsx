import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, User, Package } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';
import { scanService } from '../../../services/staff/scanService';

const ScanResultScreen = () => {
  const router = useRouter();
  const { resultRaw, imageUri } = useLocalSearchParams();
  const result = resultRaw ? JSON.parse(resultRaw as string) : null;
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setLoading(true);
      await scanService.updateOrderStatus(result.orderId, newStatus, imageUri as string);

      Alert.alert('Success', `Order status updated to ${newStatus}`, [
        { text: 'Back to Home', onPress: () => router.replace('/(protected)/(staff)/home') }
      ]);
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!result) return null;

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Scan Result</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ alignItems: 'center', padding: 30, backgroundColor: COLORS.WHITE }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={50} color="#16A34A" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Order Found</Text>
        <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 4 }}>ID: #{result.orderId.substring(result.orderId.length - 8).toUpperCase()}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={[styles.orderCard, { paddingVertical: 24, marginHorizontal: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <User size={20} color={COLORS.PRIMARY} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginLeft: 12 }}>{result.customerName}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Package size={20} color={COLORS.PRIMARY} />
            <Text style={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, marginLeft: 12 }}>{result.serviceMode} Service</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 }}>
            <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>Current Status</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.PRIMARY }}>{result.status}</Text>
          </View>
        </View>

        {imageUri && (
          <View style={[styles.orderCard, { padding: 8, marginHorizontal: 20, marginTop: 16 }]}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.TEXT_PRIMARY, margin: 8 }}>Condition Attachment</Text>
            <Image source={{ uri: imageUri as string }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
          </View>
        )}

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.TEXT_SECONDARY, marginBottom: 12 }}>APPROVE ACTION</Text>

          {result.status === 'READY_FOR_PICKUP' && (
            <TouchableOpacity
              style={[styles.primaryAction, { marginLeft: 0, height: 56, justifyContent: 'center' }]}
              onPress={() => handleUpdateStatus('PICKED_UP')}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Confirm Pickup</Text>}
            </TouchableOpacity>
          )}

          {result.status === 'PROCESSING_COMPLETE' && (
            <TouchableOpacity
              style={[styles.primaryAction, { marginLeft: 0, height: 56, justifyContent: 'center', backgroundColor: '#8B5CF6' }]}
              onPress={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Out for Delivery</Text>}
            </TouchableOpacity>
          )}

          {result.status === 'OUT_FOR_DELIVERY' && (
            <TouchableOpacity
              style={[styles.primaryAction, { marginLeft: 0, height: 56, justifyContent: 'center', backgroundColor: '#10B981' }]}
              onPress={() => handleUpdateStatus('DELIVERED')}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.WHITE} /> : <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Confirm Delivery</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};

export default ScanResultScreen;
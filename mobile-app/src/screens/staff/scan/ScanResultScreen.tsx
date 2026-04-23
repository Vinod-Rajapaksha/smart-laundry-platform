import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, User, Package, MapPin, 
  Clock, Calendar, CreditCard, ShieldCheck 
} from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { scanService } from '../../../services/staff/scanService';
import { notify } from '../../../utils/notify';

const ScanResultScreen = () => {
  const router = useRouter();
  const { resultRaw, imageUri } = useLocalSearchParams();
  const result = resultRaw ? JSON.parse(resultRaw as string) : null;
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setLoading(true);
      await scanService.updateOrderStatus(result.orderId, newStatus, imageUri as string);
      
      const targetPath = newStatus === 'PICKED_UP' 
        ? '/(protected)/(staff)/scan/pickup-confirmation'
        : '/(protected)/(staff)/scan/delivery-confirmation';

      router.push({
        pathname: targetPath,
        params: { 
          orderId: result.orderNo,
          customerName: result.customerName,
          totalAmount: result.totalAmount.toString()
        }
      });
    } catch (error: any) {
       notify.error('Update Failed', error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!result) return null;

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
    <ScreenWrapper header={header} style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Order Found Info */}
        <View style={s.topInfo}>
           <View>
              <Text style={s.orderStatusLabel}>ORDER VERITION SUCCESS</Text>
              <Text style={s.orderNoText}>#{result.orderNo}</Text>
           </View>
           <View style={[s.paidBadge, result.paymentStatus === 'PAID' ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEE2E2' }]}>
              <Text style={[s.paidText, result.paymentStatus === 'PAID' ? { color: '#16A34A' } : { color: '#DC2626' }]}>
                {result.paymentStatus}
              </Text>
           </View>
        </View>

        {/* Service Summary Card */}
        <View style={s.card}>
           <View style={s.serviceRow}>
              <View style={s.serviceIconBox}>
                 <Package size={24} color={COLORS.PRIMARY} />
              </View>
              <View style={s.serviceMain}>
                 <Text style={s.serviceName}>{result.serviceMode}</Text>
                 <Text style={s.serviceMeta}>{result.itemsCount} Items • Professional Care</Text>
              </View>
              <Text style={s.servicePrice}>Rs {result.totalAmount.toLocaleString()}</Text>
           </View>
        </View>

        {/* Customer Details Card */}
        <View style={s.card}>
           <View style={s.cardHeader}>
              <User size={18} color={COLORS.PRIMARY} />
              <Text style={s.cardTitle}>Customer Details</Text>
           </View>
           
           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Name</Text>
              <Text style={s.detailValue}>{result.customerName}</Text>
           </View>
           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Phone</Text>
              <Text style={[s.detailValue, { color: COLORS.PRIMARY }]}>{result.customerPhone}</Text>
           </View>
           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Address</Text>
              <Text style={s.detailValue}>{result.customerAddress}</Text>
           </View>
        </View>

        {/* Logistics Card */}
        <View style={s.card}>
           <View style={s.cardHeader}>
              <Clock size={18} color={COLORS.PRIMARY} />
              <Text style={s.cardTitle}>Logistics Information</Text>
           </View>

           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Current Status</Text>
              <Text style={[s.detailValue, { color: COLORS.PRIMARY }]}>{result.status.replace('_', ' ')}</Text>
           </View>
           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Time Window</Text>
              <Text style={s.detailValue}>{result.status === 'READY_FOR_PICKUP' ? result.pickupSlot : result.deliverySlot}</Text>
           </View>
           <View style={s.detailRow}>
              <Text style={s.detailLabel}>Payment Mode</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                 <CreditCard size={14} color={COLORS.TEXT_SECONDARY} />
                 <Text style={s.detailValue}>{result.paymentMethod}</Text>
              </View>
           </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          {result.status === 'PICKUP_ARRIVED' && (
            <TouchableOpacity 
              style={s.confirmBtn}
              onPress={() => handleUpdateStatus('PICKED_UP')}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <>
                  <ShieldCheck size={20} color={COLORS.WHITE} style={{ marginRight: 8 }} />
                  <Text style={s.confirmBtnText}>Confirm Pickup</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {result.status === 'PICKED_UP' && (
            <TouchableOpacity 
              style={[s.confirmBtn, { backgroundColor: '#8B5CF6' }]}
              onPress={() => handleUpdateStatus('HANDED_OVER')}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <>
                  <Package size={20} color={COLORS.WHITE} style={{ marginRight: 8 }} />
                  <Text style={s.confirmBtnText}>Handover to Laundry</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {result.status === 'DELIVERY_ARRIVED' && (
            <TouchableOpacity 
              style={[s.confirmBtn, { backgroundColor: '#1E293B' }]}
              onPress={() => handleUpdateStatus('DELIVERED')}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <>
                  <Package size={20} color={COLORS.WHITE} style={{ marginRight: 8 }} />
                  <Text style={s.confirmBtnText}>Confirm Delivery</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  backBtn: {
    padding: 4,
  },
  topInfo: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    letterSpacing: 0.5,
  },
  orderNoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 4,
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paidText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '900',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceMain: {
    flex: 1,
    marginLeft: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  serviceMeta: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  confirmBtn: {
    backgroundColor: '#0D47A1',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  confirmBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  }
});

export default ScanResultScreen;
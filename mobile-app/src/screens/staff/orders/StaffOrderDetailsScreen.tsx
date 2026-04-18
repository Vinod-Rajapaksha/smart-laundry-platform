import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MapPin, Package, Clock, ShieldIcon, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Screen providing comprehensive details and operational controls for an order.
 * Specialized for Staff users with status updates and logistics info.
 */
const StaffOrderDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Mock operational data
  const order = {
    id: orderId || 'ORD-1234',
    customer: 'John Doe',
    phone: '+94 77 123 4567',
    address: 'No. 123, Ward Place, Colombo 07',
    status: 'PICKUP_READY',
    itemsCount: 10,
    itemsList: [
      { name: 'Casual Shirts', qty: 5 },
      { name: 'Trousers', qty: 3 },
      { name: 'Towels', qty: 2 }
    ],
    serviceType: 'Wash & Fold',
    instructions: 'Ring bell at the gate. Fragile items included.'
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Order Process</Text>
        </View>
        <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: COLORS.SUCCESS_TEXT, fontSize: 12, fontWeight: '800' }}>ACTIVE</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        {/* Customer Quick Card */}
        <View style={staffDetailStyles.customerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={staffDetailStyles.avatarLarge}>
              <Text style={staffDetailStyles.avatarText}>{order.customer[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={staffDetailStyles.custName}>{order.customer}</Text>
              <Text style={staffDetailStyles.orderId}>{order.id}</Text>
            </View>
            <TouchableOpacity style={staffDetailStyles.callBtn}>
              <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
          <View style={styles.addressRow}>
            <MapPin size={18} color={COLORS.PRIMARY} style={{ marginTop: 12 }} />
            <Text style={[styles.addressText, { marginTop: 12 }]}>{order.address}</Text>
          </View>
        </View>

        {/* Operational Info */}
        <Text style={staffDetailStyles.labelHeader}>Service Details</Text>
        <View style={staffDetailStyles.infoCard}>
          <View style={staffDetailStyles.row}>
            <Package size={20} color={COLORS.TEXT_SECONDARY} />
            <Text style={staffDetailStyles.rowText}>{order.serviceType}</Text>
          </View>
          <View style={staffDetailStyles.divider} />
          <View style={staffDetailStyles.row}>
            <Clock size={20} color={COLORS.TEXT_SECONDARY} />
            <Text style={staffDetailStyles.rowText}>Items to process: {order.itemsCount}</Text>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={staffDetailStyles.instructionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ShieldIcon size={18} color="#F59E0B" />
            <Text style={staffDetailStyles.instructTitle}>Special Instructions</Text>
          </View>
          <Text style={staffDetailStyles.instructText}>{order.instructions}</Text>
        </View>

        {/* Next Step Action */}
        <View style={staffDetailStyles.actionBox}>
          <Text style={staffDetailStyles.actionLabel}>NEXT STEP</Text>
          <TouchableOpacity
            style={staffDetailStyles.mainActionBtn}
            onPress={() => router.push('/(protected)/(staff)/scan/manual')}
          >
            <Text style={staffDetailStyles.mainActionText}>Verify Pickup QR</Text>
            <ChevronRight size={20} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={staffDetailStyles.viewItemsBtn}
          onPress={() => { }}
        >
          <Text style={staffDetailStyles.viewItemsText}>View Inventory List</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const staffDetailStyles = StyleSheet.create({
  customerCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  custName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  orderId: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  callBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  instructionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 24,
  },
  instructTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  instructText: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionBox: {
    marginTop: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  mainActionBtn: {
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  mainActionText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  viewItemsBtn: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  viewItemsText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

export default StaffOrderDetailsScreen;

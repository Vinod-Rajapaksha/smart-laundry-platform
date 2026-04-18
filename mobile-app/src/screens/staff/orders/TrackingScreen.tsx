import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Navigation, MapPin, Phone, CheckCircle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const { width, height } = Dimensions.get('window');

/**
 * Screen providing a map-view and navigation for Staff (Drivers).
 * Features destination info and quick actions for arrival confirmation.
 */
const StaffTrackingScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Mock tracking data
  const trackingInfo = {
    orderId: orderId || 'ORD-1234',
    customer: 'John Doe',
    address: 'No. 123, Ward Place, Colombo 07',
    eta: '8 mins',
    distance: '1.4 km'
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#E2E8F0' }} scroll={false}>
      {/* Mock Map Background */}
      <View style={trackStyles.mockMap}>
        <View style={trackStyles.mapPlaceholder}>
          <Navigation size={48} color={COLORS.PRIMARY} opacity={0.3} />
          <Text style={trackStyles.mapText}>Map Integrated with Google Maps API</Text>
        </View>
        
        {/* Mock Pin */}
        <View style={trackStyles.userPin}>
          <View style={trackStyles.pinOuter}>
            <View style={trackStyles.pinInner} />
          </View>
        </View>
        
        <View style={trackStyles.destPin}>
          <MapPin size={32} color={COLORS.PRIMARY} fill={COLORS.PRIMARY_LIGHT} />
        </View>
      </View>

      {/* Floating Header Overlay */}
      <View style={trackStyles.headerOverlay}>
        <TouchableOpacity onPress={() => router.back()} style={trackStyles.backBtn}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Destination Card */}
      <View style={trackStyles.bottomSheet}>
        <View style={trackStyles.handle} />
        
        <View style={trackStyles.infoRow}>
          <View style={trackStyles.etaBox}>
            <Text style={trackStyles.etaValue}>{trackingInfo.eta}</Text>
            <Text style={trackStyles.etaLabel}>Away</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={trackStyles.destTitle}>Navigating to pickup</Text>
            <Text style={trackStyles.addressText} numberOfLines={1}>{trackingInfo.address}</Text>
          </View>
        </View>

        <View style={trackStyles.divider} />

        <View style={trackStyles.customerRow}>
          <View style={trackStyles.avatar}>
            <Text style={trackStyles.avatarText}>{trackingInfo.customer[0]}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={trackStyles.customerName}>{trackingInfo.customer}</Text>
            <Text style={trackStyles.orderId}>{trackingInfo.orderId}</Text>
          </View>
          <TouchableOpacity style={trackStyles.actionBtn}>
            <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={trackStyles.arrivalBtn}
          onPress={() => router.push('/(protected)/(staff)/scan/manual')}
        >
          <CheckCircle size={20} color={COLORS.WHITE} />
          <Text style={trackStyles.arrivalBtnText}>I have Arrived</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const trackStyles = StyleSheet.create({
  mockMap: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
  },
  mapText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  userPin: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.3,
  },
  pinOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  destPin: {
    position: 'absolute',
    top: height * 0.35,
    right: width * 0.25,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomSheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 12,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaBox: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  etaValue: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  etaLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
  },
  destTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  orderId: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalBtn: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  arrivalBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  }
});

export default StaffTrackingScreen;

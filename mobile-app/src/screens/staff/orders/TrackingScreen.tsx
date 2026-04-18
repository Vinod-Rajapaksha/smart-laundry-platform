import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Navigation, MapPin, Phone, CheckCircle } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { scanService } from '../../../services/staff/scanService';
import { notify } from '../../../utils/notify';

const { width, height } = Dimensions.get('window');

/**
 * Screen providing a map-view and navigation for Staff (Drivers).
 * Features destination info and quick actions for arrival confirmation.
 */
const StaffTrackingScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [staffLocation, setStaffLocation] = useState<any>(null);

  useEffect(() => {
    const initTracking = async () => {
      try {
        setLoading(true);

        // 1. Get Order Details
        const orderData = await scanService.getOrderById(orderId as string);
        setOrder(orderData);

        // 2. Initial Location Permission & Get Current
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          notify.error('Permission Denied', 'Location access is required for tracking');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setStaffLocation(location.coords);

        // 3. Subscribe to location updates
        const subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          (newLoc) => {
            setStaffLocation(newLoc.coords);
          }
        );

        return () => subscription.remove();
      } catch (error) {
        notify.error('Tracking Error', 'Could not initialize map tracking');
      } finally {
        setLoading(false);
      }
    };

    initTracking();
  }, [orderId]);

  const handleCall = () => {
    if (order?.userId?.telephone) {
      Linking.openURL(`tel:${order.userId.telephone}`);
    }
  };

  const isPickup = order?.status?.includes('PICKUP') || order?.status === 'PENDING';
  const destCoords = isPickup
    ? { latitude: order?.pickupLat || 6.9271, longitude: order?.pickupLng || 79.8612 }
    : { latitude: order?.deliveryLat || 6.9271, longitude: order?.deliveryLng || 79.8612 };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: COLORS.WHITE }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={{ textAlign: 'center', marginTop: 12, color: COLORS.TEXT_SECONDARY }}>Initializing Map...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#E2E8F0' }} scroll={false}>
      {/* Real Map View */}
      <View style={trackStyles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: staffLocation?.latitude || destCoords.latitude,
            longitude: staffLocation?.longitude || destCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Rider Marker */}
          {staffLocation && (
            <Marker coordinate={staffLocation} title="Your Location">
              <View style={trackStyles.userPin}>
                <View style={trackStyles.pinOuter}>
                  <View style={trackStyles.pinInner} />
                </View>
              </View>
            </Marker>
          )}

          {/* Destination Marker */}
          <Marker coordinate={destCoords} title="Customer Location">
            <View style={trackStyles.destPinMarker}>
              <MapPin size={34} color={COLORS.PRIMARY} fill={COLORS.PRIMARY_LIGHT} />
            </View>
          </Marker>
        </MapView>
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
            <Text style={trackStyles.etaValue}>~15</Text>
            <Text style={trackStyles.etaLabel}>Mins</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={trackStyles.destTitle}>
              {order?.status?.includes('PICKUP') ? 'Pickup Items' : 'Deliver Order'}
            </Text>
            <Text style={trackStyles.addressText} numberOfLines={1}>
              {isPickup ? order?.pickupAddress : order?.deliveryAddress}
            </Text>
          </View>
        </View>

        <View style={trackStyles.divider} />

        <View style={trackStyles.customerRow}>
          <View style={trackStyles.avatar}>
            <Text style={trackStyles.avatarText}>{order?.userId?.name[0] || 'C'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={trackStyles.customerName}>{order?.userId?.name || 'Customer'}</Text>
            <Text style={trackStyles.orderId}>#{order?.orderNo}</Text>
          </View>
          <TouchableOpacity style={trackStyles.actionBtn} onPress={handleCall}>
            <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={trackStyles.arrivalBtn}
          onPress={() => router.push({
            pathname: '/(protected)/(staff)/scan/qr-scanner',
            params: { orderId: order?._id }
          })}
        >
          <CheckCircle size={20} color={COLORS.WHITE} />
          <Text style={trackStyles.arrivalBtnText}>I have Arrived</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const trackStyles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
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
  destPinMarker: {
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

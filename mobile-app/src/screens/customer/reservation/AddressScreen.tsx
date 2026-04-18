import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, MapPin, LocateFixed } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAddress, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Address.styles';

const DEFAULT_REGION = {
  latitude: 6.9271, // Colombo
  longitude: 79.8612,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const AddressScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pickupAddress, deliveryAddress, pickupLat, pickupLng } = useAppSelector((state) => state.reservation);

  const [pickup, setPickup] = useState(pickupAddress || '');
  const [delivery, setDelivery] = useState(deliveryAddress || '');
  const [sameAsPickup, setSameAsPickup] = useState(true);
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: pickupLat || DEFAULT_REGION.latitude,
    longitude: pickupLng || DEFAULT_REGION.longitude,
    latitudeDelta: DEFAULT_REGION.latitudeDelta,
    longitudeDelta: DEFAULT_REGION.longitudeDelta,
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setLocationLoading(true);
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results && results.length > 0) {
        const addr = results[0];
        const formatted = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim().replace(/^ ,/, '');
        setPickup(formatted);
      }
    } catch (error) {
      console.error('Reverse Geocode failed', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(prev => ({ ...prev, latitude, longitude }));
    reverseGeocode(latitude, longitude);
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({ ...DEFAULT_REGION, latitude, longitude });
      reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Get Current Location failed', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNext = () => {
    dispatch(setAddress({ 
      pickup, 
      delivery: sameAsPickup ? pickup : delivery,
      pickupLat: region.latitude,
      pickupLng: region.longitude,
      deliveryLat: sameAsPickup ? region.latitude : null,
      deliveryLng: sameAsPickup ? region.longitude : null,
    }));
    dispatch(nextStep());
    router.push('/(protected)/(customer)/reservation/reservation-summary');
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <View style={commonStyles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={[commonStyles.stepDot, s <= 5 && commonStyles.stepDotActive]} />
        ))}
      </View>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity 
        style={[commonStyles.primaryButton, !pickup && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!pickup || locationLoading}
      >
        <Text style={commonStyles.primaryButtonText}>Continue to Summary</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll
      withKeyboardAvoidingView
    >
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Where are you located?</Text>
        <Text style={commonStyles.subtitle}>
          Select on map or enter manually for pickup.
        </Text>

        <View style={styles.mapCard}>
           <View style={styles.mapWrapper}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onPress={handleMapPress}
              >
                <Marker 
                  coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                  draggable
                  onDragEnd={handleMapPress}
                  title="Pickup Location"
                />
              </MapView>
              <TouchableOpacity style={styles.locateBtn} onPress={getCurrentLocation}>
                 <LocateFixed size={20} color={COLORS.PRIMARY} />
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.scrollContent}>
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
               <Text style={styles.sectionTitle}>Pickup Address</Text>
               {locationLoading && <ActivityIndicator size="small" color={COLORS.PRIMARY} />}
            </View>
            <TextInput
              style={styles.input}
              placeholder="House no, Street name, City..."
              placeholderTextColor={COLORS.TEXT_MUTED}
              multiline
              value={pickup}
              onChangeText={setPickup}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            {!sameAsPickup && (
              <TextInput
                style={styles.input}
                placeholder="House no, Street name, City..."
                placeholderTextColor={COLORS.TEXT_MUTED}
                multiline
                value={delivery}
                onChangeText={setDelivery}
              />
            )}
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setSameAsPickup(!sameAsPickup)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, sameAsPickup && styles.checkboxActive]}>
                 {sameAsPickup && <Check size={14} color={COLORS.WHITE} />}
              </View>
              <Text style={styles.checkboxLabel}>Same as pickup address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddressScreen;

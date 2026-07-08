import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, LocateFixed, Search } from 'lucide-react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAddress, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Address.styles';
import { useDebounce } from '../../../hooks/useDebounce';
import { osmService, OSMPlace } from '../../../services/maps/osmService';

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
  const userAddress = useAppSelector((state) => state.auth.user?.address);

  const [pickup, setPickup] = useState(pickupAddress || userAddress || '');
  const [delivery, setDelivery] = useState(deliveryAddress || userAddress || '');
  const [sameAsPickup, setSameAsPickup] = useState(true);
  
  useEffect(() => {
    if (!pickup && userAddress) setPickup(userAddress);
    if (!delivery && userAddress) setDelivery(userAddress);
  }, [userAddress]);

  const [locationLoading, setLocationLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  
  const [region, setRegion] = useState({
    latitude: pickupLat || DEFAULT_REGION.latitude,
    longitude: pickupLng || DEFAULT_REGION.longitude,
    latitudeDelta: DEFAULT_REGION.latitudeDelta,
    longitudeDelta: DEFAULT_REGION.longitudeDelta,
  });

  // Search logic
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OSMPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (debouncedSearchQuery.trim().length >= 3) {
        setIsSearching(true);
        const results = await osmService.searchPlaces(debouncedSearchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    fetchPlaces();
  }, [debouncedSearchQuery]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLocationLoading(true);
    const address = await osmService.reverseGeocode(lat, lng);
    setPickup(address);
    setLocationLoading(false);
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setRegion({ ...DEFAULT_REGION, latitude, longitude });
      mapRef.current?.animateToRegion({
        latitude, longitude,
        latitudeDelta: DEFAULT_REGION.latitudeDelta, longitudeDelta: DEFAULT_REGION.longitudeDelta
      });
      reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Get Current Location failed', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const [mapReady, setMapReady] = useState(!!pickupLat && !!pickupLng);

  useEffect(() => {
    if (!pickupLat && !pickupLng) {
      getCurrentLocation().then(() => setMapReady(true));
    } else {
      setMapReady(true);
    }
  }, []);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(prev => ({ ...prev, latitude, longitude }));
    mapRef.current?.animateToRegion({
      latitude, longitude,
      latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta
    });
    reverseGeocode(latitude, longitude);
  };

  const handleSelectPlace = (place: OSMPlace) => {
    Keyboard.dismiss();
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    
    setPickup(place.display_name);
    setSearchQuery('');
    setSearchResults([]);
    
    setRegion(prev => ({ ...prev, latitude: lat, longitude: lon }));
    mapRef.current?.animateToRegion({
      latitude: lat, longitude: lon,
      latitudeDelta: DEFAULT_REGION.latitudeDelta, 
      longitudeDelta: DEFAULT_REGION.longitudeDelta
    });
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
    router.back();
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity 
        style={[commonStyles.primaryButton, !pickup && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!pickup || locationLoading}
      >
        <Text style={commonStyles.primaryButtonText}>Confirm Location</Text>
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
          Select on map or search for pickup location.
        </Text>

        <View style={{ zIndex: 10, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1.5, borderColor: COLORS.BORDER_LIGHT, height: 50 }}>
            <Search size={20} color={COLORS.TEXT_MUTED} />
            <TextInput
              style={{ flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.TEXT_PRIMARY }}
              placeholder="Search for an area or building..."
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {isSearching && <ActivityIndicator size="small" color={COLORS.PRIMARY} />}
          </View>

          {searchResults.length > 0 && (
            <View style={{ backgroundColor: COLORS.WHITE, borderRadius: 16, marginTop: 8, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, maxHeight: 200, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.place_id.toString()}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                    onPress={() => handleSelectPlace(item)}
                  >
                    <Text style={{ fontSize: 14, color: COLORS.TEXT_PRIMARY, fontWeight: '600' }} numberOfLines={2}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <View style={[styles.mapCard, { marginTop: 16, zIndex: -1 }]}>
           <View style={styles.mapWrapper}>
              {!mapReady ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                  <Text style={{ marginTop: 12, color: COLORS.TEXT_SECONDARY }}>Initializing Map...</Text>
                </View>
              ) : (
                <>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onPress={handleMapPress}
                    mapType="none"
                  >
                    <UrlTile
                      urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                      maximumZ={19}
                      flipY={false}
                    />
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
                </>
              )}
           </View>
        </View>


        <View style={[styles.scrollContent, { zIndex: -1 }]}>
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

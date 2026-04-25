import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, LocateFixed, MapPin } from 'lucide-react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';
import profileService from '../../../services/customer/profileService';
import { osmService } from '../../../services/maps/osmService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateUser } from '../../../store/slices/auth.slice';
import { addressSchema } from '../../../validation/address.schema';

const AddressesScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const params = useLocalSearchParams();
  const initialAddress = params.address as string || '';

  const [address, setAddress] = useState(initialAddress);
  const [label, setLabel] = useState('Home');
  const [saving, setSaving] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async (forceUpdate = false) => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion(prev => ({ ...prev, latitude, longitude }));
      mapRef.current?.animateToRegion({
        latitude, longitude,
        latitudeDelta: 0.01, longitudeDelta: 0.01
      });

      if (!initialAddress || !address || forceUpdate) {
        reverseGeocode(latitude, longitude);
      }
    } catch (error) {
      console.error('Get Current Location failed', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoadingLocation(true);
    try {
      const result = await osmService.reverseGeocode(lat, lng);
      setAddress(result);
      if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
    } catch (error) {
      console.error("Reverse geocode failed", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(prev => ({ ...prev, latitude, longitude }));
    mapRef.current?.animateToRegion({
      latitude, longitude,
      latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta
    });
    reverseGeocode(latitude, longitude);
  };

  const handleSave = async () => {
    const validation = addressSchema.safeParse({ label, address, isDefault: true });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        newErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile({ address });

      dispatch(updateUser(updatedProfile));

      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, ...updatedProfile }));
      }

      Alert.alert('Success', 'Address updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update address');
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <ChevronLeft size={28} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>Saved Address</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={styles.formContainer}>

        {/* Map View Integration */}
        <View style={localStyles.mapCard}>
          <View style={localStyles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={localStyles.map}
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
                title="Your Location"
              />
            </MapView>
            <TouchableOpacity style={localStyles.locateBtn} onPress={() => getCurrentLocation()}>
              <LocateFixed size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
          <View style={localStyles.mapInstruction}>
            <MapPin size={16} color={COLORS.TEXT_MUTED} />
            <Text style={localStyles.instructionText}>Tap or drag the pin to set your location</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Label (e.g. Home, Office)</Text>
          <TextInput
            style={[styles.input, errors.label && { borderColor: COLORS.ERROR }]}
            value={label}
            onChangeText={(val) => {
              setLabel(val);
              if (errors.label) setErrors(prev => ({ ...prev, label: '' }));
            }}
            placeholder="Home"
            placeholderTextColor={COLORS.TEXT_MUTED}
          />
          {errors.label && <Text style={{ color: COLORS.ERROR, fontSize: 10, marginTop: 4 }}>{errors.label}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.label}>Primary Delivery Address</Text>
            {loadingLocation && <ActivityIndicator size="small" color={COLORS.PRIMARY} />}
          </View>

          <TouchableOpacity
            style={localStyles.autoFillBtn}
            onPress={() => getCurrentLocation(true)}
          >
            <LocateFixed size={18} color={COLORS.PRIMARY} />
            <Text style={localStyles.autoFillText}>Auto-fill from current location</Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, styles.textArea, errors.address && { borderColor: COLORS.ERROR }]}
            value={address}
            onChangeText={(val) => {
              setAddress(val);
              if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
            }}
            placeholder="House, Street, City..."
            placeholderTextColor={COLORS.TEXT_MUTED}
            multiline
          />
          {errors.address && <Text style={{ color: COLORS.ERROR, fontSize: 10, marginTop: 4 }}>{errors.address}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const localStyles = StyleSheet.create({
  mapCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.WHITE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: '500',
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  autoFillText: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  }
});

export default AddressesScreen;

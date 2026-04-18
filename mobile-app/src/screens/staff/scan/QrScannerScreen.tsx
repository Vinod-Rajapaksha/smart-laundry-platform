import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { X, Image as ImageIcon } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/scanStyles';
import { scanService } from '../../../services/staff/scanService';

const QrScannerScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      // Validate with our service which handles order fetching
      const result = await scanService.validateQrCode(data);

      // If valid, pass the result and attachment to the confirmation screen
      router.push({
        pathname: '/(protected)/(staff)/scan/result',
        params: { resultRaw: JSON.stringify(result), imageUri: imageUri || '' }
      });

    } catch (error: any) {
      Alert.alert('Scan Failed', error.message || 'Invalid QR Code', [
        { text: 'Try Again', onPress: () => setScanned(false) }
      ]);
    }
  };

  const captureImageCondition = async () => {
    // Request permission if not already granted
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to capture images.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  if (hasPermission === null) {
    return (
      <ScreenWrapper style={{ backgroundColor: COLORS.BLACK }} scroll={false}>
        <View />
      </ScreenWrapper>
    );
  }
  if (hasPermission === false) {
    return (
      <ScreenWrapper
        style={{ backgroundColor: COLORS.BLACK, alignItems: 'center', justifyContent: 'center' }}
        scroll={false}
      >
        <Text style={{ color: COLORS.WHITE }}>No access to camera</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      statusBarColor={COLORS.BLACK}
      barStyle="light-content"
      style={{ backgroundColor: COLORS.BLACK }}
      scroll={false}
    >
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>

          <View style={styles.header}>
            <View style={{ width: 40 }} />
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.scanText}>
              Align the QR code within the frame to scan automatically
            </Text>

            <TouchableOpacity style={styles.manualButton} onPress={() => router.push('/(protected)/(staff)/scan/manual-entry')}>
              <Text style={styles.manualButtonText}>Enter Order ID Manually</Text>
            </TouchableOpacity>
          </View>

          {/* Feature: Staff capturing condition images before validating */}
          <TouchableOpacity
            style={styles.imageBadge}
            onPress={captureImageCondition}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: 46, height: 46, borderRadius: 23 }} />
            ) : (
              <ImageIcon size={24} color={COLORS.TEXT_SECONDARY} />
            )}
          </TouchableOpacity>

        </View>
      </CameraView>
    </ScreenWrapper>
  );
};

export default QrScannerScreen;
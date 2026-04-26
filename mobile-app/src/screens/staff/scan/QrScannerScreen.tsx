import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { X, Image as ImageIcon, Flashlight, Keyboard, Scan } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { scanService } from '../../../services/staff/scanService';
import { notify } from '../../../utils/notify';

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.75;

const QrScannerScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const result = await scanService.validateQrCode(data);
      router.push({
        pathname: '/(protected)/(staff)/scan/result',
        params: { resultRaw: JSON.stringify(result), imageUri: imageUri || '' }
      });
    } catch (error: any) {
      router.push('/(protected)/(staff)/scan/invalid-qr');
      setScanned(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri);
        
        notify.info('Processing Image', 'Extracting QR data...');
        
        try {
          const decodedData = await scanService.decodeQrFromImage(selectedUri);
          const validationResult = await scanService.validateQrCode(decodedData);
          
          router.push({
            pathname: '/(protected)/(staff)/scan/result',
            params: { 
              resultRaw: JSON.stringify(validationResult), 
              imageUri: selectedUri 
            }
          });
        } catch (error: any) {
          notify.error('Extraction Failed', error.message || 'Could not find a valid QR code');
          // Fallback to manual entry if extraction fails
          router.push({
            pathname: '/(protected)/(staff)/scan/manual-entry',
            params: { attachedImage: selectedUri, fromGallery: 'true' }
          });
        }
      }
    } catch (error) {
      notify.error('Gallery Error', 'Failed to access media library');
    }
  };

  if (hasPermission === null) return <ScreenWrapper style={{ backgroundColor: COLORS.BLACK }}><View /></ScreenWrapper>;
  if (hasPermission === false) return (
    <ScreenWrapper style={{ backgroundColor: COLORS.BLACK, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: COLORS.WHITE }}>Camera access denied</Text>
    </ScreenWrapper>
  );

  return (
    <ScreenWrapper
      statusBarColor="transparent"
      barStyle="light-content"
      style={{ backgroundColor: COLORS.BLACK }}
    >
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        <View style={s.overlay}>
          {/* Header */}
          <View style={s.header}>
            <View style={{ width: 44 }} />
            <View style={s.headerInfo}>
              <Text style={s.brandTitle}>B & W Laundry</Text>
              <Text style={s.brandSub}>ORDER VERIFICATION</Text>
            </View>
            <TouchableOpacity style={s.iconCircle} onPress={() => setTorch(!torch)}>
              <Flashlight size={20} color={COLORS.WHITE} fill={torch ? COLORS.WHITE : 'transparent'} />
            </TouchableOpacity>
          </View>

          {/* Scanner Area */}
          <View style={s.scannerContainer}>
            <View style={s.scanFrame}>
              <View style={[s.corner, s.topLeft]} />
              <View style={[s.corner, s.topRight]} />
              <View style={[s.corner, s.bottomLeft]} />
              <View style={[s.corner, s.bottomRight]} />

              <View style={s.centerIcon}>
                <Scan size={80} color="rgba(255,255,255,0.2)" strokeWidth={1} />
              </View>
              <View style={s.scanLine} />
            </View>

            <View style={s.infoArea}>
              <Text style={s.mainTitle}>Scan customer QR code to verify order</Text>
              <Text style={s.subTitle}>Align the QR code within the frame to scan automatically</Text>
            </View>

            <TouchableOpacity
              style={s.manualBtn}
              onPress={() => router.push('/(protected)/(staff)/scan/manual-entry')}
            >
              <Keyboard size={20} color={COLORS.WHITE} style={{ marginRight: 10 }} />
              <Text style={s.manualBtnText}>Enter Code Manually</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Gallery */}
          <View style={s.footer}>
            <TouchableOpacity style={s.galleryBtn} onPress={pickImage}>
              <View style={[s.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <ImageIcon size={22} color={COLORS.WHITE} />
              </View>
              <Text style={s.galleryText}>GALLERY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </ScreenWrapper>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  headerInfo: {
    alignItems: 'center',
  },
  brandTitle: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 40,
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#2563EB',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 20 },
  centerIcon: {
    opacity: 0.5,
  },
  scanLine: {
    position: 'absolute',
    width: '90%',
    height: 2,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  infoArea: {
    marginTop: 40,
    alignItems: 'center',
  },
  mainTitle: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
  },
  subTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  manualBtn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#0D47A1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  manualBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  galleryBtn: {
    alignItems: 'center',
    gap: 8,
  },
  galleryText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    left: 25,
  }
});

export default QrScannerScreen;
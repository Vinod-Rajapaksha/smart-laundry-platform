import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, Info, ShoppingBag } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen providing logistics details for an order delivery.
 * Includes driver info, scheduled time, and location details.
 */
const DeliveryDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Mock logistics data
  const delivery = {
    orderId: orderId || 'ORD-1234',
    status: 'In Transit',
    date: 'Thursday, 26 May 2024',
    timeSlot: '02:00 PM - 04:00 PM',
    address: 'No. 123, Luxury Apartments, Ward Place, Colombo 07',
    instructions: 'Please leave with the security desk if I am not available.',
    driver: {
      name: 'Saman Silva',
      phone: '+94 71 987 6543',
      rating: 4.8,
      image: null
    }
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Delivery Details</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        {/* Status Section */}
        <View style={logStyles.mainCard}>
          <View style={[logStyles.statusBanner, { backgroundColor: COLORS.SUCCESS }]}>
            <ShoppingBag size={20} color={COLORS.WHITE} />
            <Text style={logStyles.statusBannerText}>{delivery.status.toUpperCase()}</Text>
          </View>
          
          <View style={logStyles.cardBody}>
            <Text style={logStyles.label}>Expected Delivery</Text>
            <Text style={logStyles.valueBig}>{delivery.date}</Text>
            
            <View style={logStyles.divider} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={20} color={COLORS.SUCCESS} />
              <View style={{ marginLeft: 12 }}>
                <Text style={logStyles.label}>Estimated Arrival</Text>
                <Text style={logStyles.value}>{delivery.timeSlot}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <Text style={logStyles.sectionTitle}>Delivery Destination</Text>
        <View style={logStyles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <MapPin size={24} color={COLORS.SUCCESS} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={logStyles.addressText}>{delivery.address}</Text>
              
              <View style={logStyles.instructionBox}>
                <Info size={16} color={COLORS.TEXT_SECONDARY} />
                <Text style={logStyles.instructionText}>{delivery.instructions}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Section */}
        <Text style={logStyles.sectionTitle}>Assigned Driver</Text>
        <View style={logStyles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[logStyles.driverAvatar, { backgroundColor: '#F0FDF4' }]}>
              <User size={32} color={COLORS.SUCCESS_TEXT} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={logStyles.driverName}>{delivery.driver.name}</Text>
              <Text style={logStyles.driverRating}>⭐ {delivery.driver.rating} Rating</Text>
            </View>
            <TouchableOpacity style={[logStyles.callButton, { backgroundColor: COLORS.PRIMARY }]}>
              <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={logStyles.helpButton}
          onPress={() => router.push('/(protected)/(customer)/profile/help-support')}
        >
          <Text style={logStyles.helpButtonText}>Issue with your Delivery?</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const logStyles = StyleSheet.create({
  mainCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 24,
  },
  statusBanner: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statusBannerText: {
    color: COLORS.WHITE,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  cardBody: {
    padding: 24,
  },
  label: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  valueBig: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  addressText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    lineHeight: 22,
  },
  instructionBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  instructionText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    fontStyle: 'italic',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  driverRating: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  helpButton: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  helpButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

export default DeliveryDetailsScreen;

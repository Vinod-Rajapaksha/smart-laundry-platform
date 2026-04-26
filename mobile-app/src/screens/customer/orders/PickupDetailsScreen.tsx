import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, Info } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Orders.styles';

/**
 * Screen providing logistics details for an order pickup.
 * Includes driver info, scheduled time, and location details.
 */
const PickupDetailsScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Mock logistics data
  const pickup = {
    orderId: orderId || 'ORD-1234',
    status: 'Scheduled',
    date: 'Wednesday, 25 May 2024',
    timeSlot: '10:00 AM - 12:00 PM',
    address: 'No. 123, Luxury Apartments, Ward Place, Colombo 07',
    instructions: 'Please call when at the gate. My apartment is on the 4th floor.',
    driver: {
      name: 'Kamal Perera',
      phone: '+94 77 123 4567',
      rating: 4.9,
      image: null
    }
  };

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Pickup Details</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        {/* Scheduled Info */}
        <View style={logStyles.mainCard}>
          <View style={logStyles.statusBanner}>
            <Calendar size={20} color={COLORS.WHITE} />
            <Text style={logStyles.statusBannerText}>{pickup.status.toUpperCase()}</Text>
          </View>
          
          <View style={logStyles.cardBody}>
            <Text style={logStyles.label}>Scheduled Date</Text>
            <Text style={logStyles.valueBig}>{pickup.date}</Text>
            
            <View style={logStyles.divider} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={20} color={COLORS.PRIMARY} />
              <View style={{ marginLeft: 12 }}>
                <Text style={logStyles.label}>Time Window</Text>
                <Text style={logStyles.value}>{pickup.timeSlot}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <Text style={logStyles.sectionTitle}>Pickup Location</Text>
        <View style={logStyles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <MapPin size={24} color={COLORS.PRIMARY} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={logStyles.addressText}>{pickup.address}</Text>
              
              <View style={logStyles.instructionBox}>
                <Info size={16} color={COLORS.TEXT_SECONDARY} />
                <Text style={logStyles.instructionText}>{pickup.instructions}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Section */}
        <Text style={logStyles.sectionTitle}>Assigned Driver</Text>
        <View style={logStyles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={logStyles.driverAvatar}>
              <User size={32} color={COLORS.TEXT_SECONDARY} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={logStyles.driverName}>{pickup.driver.name}</Text>
              <Text style={logStyles.driverRating}>⭐ {pickup.driver.rating} Rating</Text>
            </View>
            <TouchableOpacity style={logStyles.callButton}>
              <Phone size={20} color={COLORS.WHITE} fill={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={logStyles.helpButton}
          onPress={() => router.push('/(protected)/(customer)/profile/help-support')}
        >
          <Text style={logStyles.helpButtonText}>Need Help with Pickup?</Text>
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
    backgroundColor: COLORS.PRIMARY,
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
    backgroundColor: '#F1F5F9',
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
    backgroundColor: COLORS.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.SUCCESS,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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

export default PickupDetailsScreen;

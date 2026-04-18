import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, ChevronRight, Home, ListOrdered } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/ReservationSuccess.styles';

const ReservationSuccessScreen = () => {
  const router = useRouter();

  return (
    <ScreenWrapper
      style={[commonStyles.safeArea, { backgroundColor: COLORS.WHITE }]}
      scroll={false}
    >
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        
        <View style={styles.iconContainer}>
           <CheckCircle2 size={80} color={COLORS.SUCCESS} strokeWidth={2.5} />
        </View>

        <Text style={styles.title}>Reservation Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your laundry pickup has been scheduled successfully. Our team will contact you shortly.
        </Text>

        <View style={styles.buttonContainer}>
           <TouchableOpacity 
             style={styles.primaryBtn}
             onPress={() => router.push('/(protected)/(customer)/home')}
           >
              <Home size={20} color={COLORS.WHITE} />
              <Text style={styles.primaryBtnText}>Back to Home</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={styles.secondaryBtn}
             onPress={() => router.push('/(protected)/(customer)/orders')}
           >
              <ListOrdered size={20} color={COLORS.PRIMARY} />
              <Text style={styles.secondaryBtnText}>View My Orders</Text>
              <ChevronRight size={18} color={COLORS.PRIMARY} />
           </TouchableOpacity>
        </View>

      </View>
    </ScreenWrapper>
  );
};

export default ReservationSuccessScreen;

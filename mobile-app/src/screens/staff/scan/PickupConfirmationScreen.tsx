import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, LayoutGrid } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';

const PickupConfirmationScreen = () => {
  const router = useRouter();
  const { orderId, customerName } = useLocalSearchParams();

  const header = (
    <View style={s.header}>
       <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
       </TouchableOpacity>
       <Text style={s.headerTitle}>Confirmation</Text>
       <View style={{ width: 44 }} />
    </View>
  );

  return (
    <ScreenWrapper header={header} style={{ backgroundColor: '#F8FAFC' }}>
      <View style={s.content}>
        
        {/* Success Icon */}
        <View style={s.iconContainer}>
           <View style={s.iconBgOuter}>
              <View style={s.iconBgInner}>
                 <Check size={40} color={COLORS.WHITE} strokeWidth={4} />
              </View>
           </View>
        </View>

        {/* Text Area */}
        <View style={s.textContainer}>
           <Text style={s.title}>Pickup Confirmed{'\n'}Successfully</Text>
           <Text style={s.orderLabel}>Order Number: <Text style={s.orderId}>#{orderId}</Text></Text>
           
           <Text style={s.message}>
             Successfully collected items from <Text style={{ fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>{customerName}</Text>. Your clothes are in good hands and heading to our facility!
           </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={s.dashboardBtn}
          onPress={() => router.replace('/(protected)/(staff)/home')}
        >
           <Text style={s.dashboardBtnText}>Back to Dashboard</Text>
           <LayoutGrid size={20} color={COLORS.WHITE} style={{ marginLeft: 10 }} />
        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
};

const s = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 50,
  },
  iconBgOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 34,
  },
  orderLabel: {
    fontSize: 18,
    color: '#0D47A1',
    fontWeight: '700',
    marginTop: 15,
  },
  orderId: {
    fontWeight: '800',
  },
  message: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  dashboardBtn: {
    marginTop: 60,
    backgroundColor: '#0D47A1',
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  dashboardBtnText: {
    color: COLORS.WHITE,
    fontSize: 17,
    fontWeight: '800',
  }
});

export default PickupConfirmationScreen;

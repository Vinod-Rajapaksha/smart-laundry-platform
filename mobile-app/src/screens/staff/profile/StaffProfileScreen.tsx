import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { User, DollarSign, Clock, Settings, LogOut, ChevronRight, Star } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const StaffProfileScreen = () => {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);

  const menuItems = [
    {
      icon: <DollarSign size={22} color={COLORS.PRIMARY} />,
      title: 'Earnings',
      subtitle: 'View your daily & weekly payouts',
      onPress: () => router.push('/(protected)/(staff)/profile/earnings')
    },
    {
      icon: <Clock size={22} color={COLORS.PRIMARY} />,
      title: 'Availability',
      subtitle: 'Set your working hours',
      onPress: () => router.push('/(protected)/(staff)/profile/availability')
    },
    {
      icon: <Settings size={22} color={COLORS.PRIMARY} />,
      title: 'Settings',
      subtitle: 'Notification & security preferences',
      onPress: () => router.push('/(protected)/(staff)/profile/settings')
    }
  ];

  return (
    <ScreenWrapper scroll>
      <View style={{ padding: 30, alignItems: 'center', backgroundColor: COLORS.WHITE }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <User size={50} color={COLORS.PRIMARY} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Staff Member</Text>
        <Text style={{ fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 4 }}>Staff ID: #ST-8852</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '700', color: '#B45309' }}>4.9 Rating</Text>
        </View>
      </View>

      <View style={[styles.availabilityCard, { marginTop: 20, marginHorizontal: 20 }]}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>Duty Status</Text>
          <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>{isAvailable ? 'Available for jobs' : 'Currently off-duty'}</Text>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
          thumbColor={isAvailable ? COLORS.PRIMARY : '#94A3B8'}
        />
      </View>

      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.orderCard, { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, marginBottom: 12 }]} onPress={item.onPress}>
            <View style={{ width: 45, height: 45, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY, marginTop: 2 }}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.orderCard, { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, marginTop: 20, marginBottom: 40, marginHorizontal: 20, borderColor: '#FEE2E2' }]}
        onPress={() => router.replace('/(public)/auth/login')}
      >
        <View style={{ width: 45, height: 45, borderRadius: 12, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut size={22} color="#EF4444" />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#EF4444' }}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default StaffProfileScreen;
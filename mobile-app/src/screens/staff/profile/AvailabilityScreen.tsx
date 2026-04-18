import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityScreen = () => {
  const router = useRouter();
  const [schedule, setSchedule] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const toggleDay = (day: string) => {
    const dayKey = day as keyof typeof schedule;
    setSchedule({ ...schedule, [dayKey]: !schedule[dayKey] });
  };

  const handleSave = () => {
    // Save to backend
    router.back();
  };

  const header = (
    <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Working Hours</Text>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, marginBottom: 24 }}>
          Set your weekly availability for pickup and delivery requests.
        </Text>

        {DAYS.map((day) => (
          <View key={day} style={[styles.orderCard, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingVertical: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} color={COLORS.PRIMARY} />
              </View>
              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY }}>{day}</Text>
                <Text style={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                  {schedule[day as keyof typeof schedule] ? '08:00 AM - 06:00 PM' : 'Off-duty'}
                </Text>
              </View>
            </View>
            <Switch
              value={schedule[day as keyof typeof schedule]}
              onValueChange={() => toggleDay(day)}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={schedule[day as keyof typeof schedule] ? COLORS.PRIMARY : '#94A3B8'}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.primaryAction, { marginLeft: 0, marginTop: 20, height: 56, justifyContent: 'center' }]}
          onPress={handleSave}
        >
          <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: '700' }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default AvailabilityScreen;
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSchedule, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Schedule.styles';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIMES = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const ScheduleScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { scheduledDate } = useAppSelector((state) => state.reservation);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleNext = () => {
    const finalDate = dates[selectedDayIndex];
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    finalDate.setHours(hours, minutes, 0, 0);
    dispatch(setSchedule(finalDate.toISOString()));
    dispatch(nextStep());
    router.push('/(protected)/(customer)/reservation/address');
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <View style={commonStyles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={[commonStyles.stepDot, s <= 4 && commonStyles.stepDotActive]} />
        ))}
      </View>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity style={commonStyles.primaryButton} onPress={handleNext}>
        <Text style={commonStyles.primaryButtonText}>Confirm Schedule</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll
    >
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Pickup Schedule</Text>
        <Text style={commonStyles.subtitle}>
          When should we come and collect your laundry?
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {dates.map((date, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setSelectedDayIndex(index)}
                style={[styles.dateCard, selectedDayIndex === index && styles.dateCardActive]}
              >
                <Text style={[styles.dayText, selectedDayIndex === index && styles.whiteText]}>
                  {DAYS[date.getDay()]}
                </Text>
                <Text style={[styles.dateText, selectedDayIndex === index && styles.whiteText]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.timeGrid}>
            {TIMES.map((time) => (
              <TouchableOpacity 
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[styles.timeCard, selectedTime === time && styles.timeCardActive]}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.whiteText]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ScheduleScreen;

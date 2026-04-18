import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Sparkle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleOption, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Finishing.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { InventoryItem } from '../../../types/reservation.types';

const FinishingScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedOptions } = useAppSelector((state) => state.reservation);
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedFinishing = selectedOptions.find(o => o.categoryName === 'Finishing');

  useEffect(() => {
    const fetchFinishing = async () => {
      try {
        const data = await reservationService.getInventoryByCategory('Finishing');
        setItems(data);
      } catch (error) {
        console.error('Error fetching finishing items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishing();
  }, []);

  const handleSelect = (item: InventoryItem) => {
    dispatch(toggleOption({
      inventoryId: item._id,
      name: item.name,
      price: item.isDefault ? 0 : item.unitPrice,
      categoryName: 'Finishing'
    }));
  };

  const handleNext = () => {
    if (selectedFinishing) {
      dispatch(nextStep());
      router.push('/(protected)/(customer)/reservation/schedule');
    }
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
      <TouchableOpacity 
        style={[commonStyles.primaryButton, !selectedFinishing && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!selectedFinishing}
      >
        <Text style={commonStyles.primaryButtonText}>Continue</Text>
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
        <Text style={commonStyles.title}>Finishing Type</Text>
        <Text style={commonStyles.subtitle}>
          How should we finish and pack your garments?
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <View style={styles.scrollContent}>
            {items.map((item) => {
              const isSelected = selectedFinishing?.inventoryId === item._id;
              return (
                <TouchableOpacity 
                  key={item._id}
                  style={[
                    styles.card,
                    isSelected && styles.cardActive
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, isSelected && { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
                    <Sparkle size={24} color={isSelected ? COLORS.PRIMARY : COLORS.SUCCESS} />
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.name, isSelected && { color: COLORS.PRIMARY }]}>{item.name}</Text>
                    <Text style={styles.price}>
                      {item.isDefault ? 'Included Free' : `+ Rs.${item.unitPrice.toFixed(2)}`}
                    </Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <Check size={14} color={COLORS.WHITE} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default FinishingScreen;

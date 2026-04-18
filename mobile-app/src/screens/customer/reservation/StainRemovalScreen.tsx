import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Droplets } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleOption, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/StainRemoval.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { InventoryItem } from '../../../types/reservation.types';

const StainRemovalScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedOptions } = useAppSelector((state) => state.reservation);
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedStainOption = selectedOptions.find(o => o.categoryName === 'StainRemoval');

  useEffect(() => {
    const fetchStainRemoval = async () => {
      try {
        const data = await reservationService.getInventoryByCategory('StainRemoval');
        setItems(data);
      } catch (error) {
        console.error('Error fetching stain removal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStainRemoval();
  }, []);

  const handleSelect = (item: InventoryItem) => {
    dispatch(toggleOption({
      inventoryId: item._id,
      name: item.name,
      price: item.isDefault ? 0 : item.unitPrice,
      categoryName: 'StainRemoval'
    }));
  };

  const handleNext = () => {
    if (selectedStainOption) {
      dispatch(nextStep());
      router.push('/(protected)/(customer)/reservation/add-ons');
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { dispatch(prevStep()); router.back(); }} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <View style={commonStyles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={[commonStyles.stepDot, s <= 3 && commonStyles.stepDotActive]} />
        ))}
      </View>
    </View>
  );

  const footer = (
    <View style={commonStyles.footer}>
      <TouchableOpacity 
        style={[commonStyles.primaryButton, !selectedStainOption && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!selectedStainOption}
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
        <Text style={commonStyles.title}>Stain Removal</Text>
        <Text style={commonStyles.subtitle}>
          Need extra care for tough stains? Select the treatment type.
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <View style={styles.scrollContent}>
            {items.map((item) => {
              const isSelected = selectedStainOption?.inventoryId === item._id;
              return (
                <TouchableOpacity 
                  key={item._id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardActive
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconWrapper, isSelected && { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
                    <Droplets size={24} color={isSelected ? COLORS.PRIMARY : '#E11D48'} />
                  </View>
                  <View style={styles.infoWrapper}>
                    <Text style={[styles.optionName, isSelected && { color: COLORS.PRIMARY }]}>{item.name}</Text>
                    <Text style={styles.optionPrice}>
                      {item.isDefault ? 'Included Free' : `+ Rs.${item.unitPrice.toFixed(2)}`}
                    </Text>
                  </View>
                  <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
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

export default StainRemovalScreen;

import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Wind } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleOption, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/FabricCare.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { InventoryItem } from '../../../types/reservation.types';

const FabricCareScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedOptions } = useAppSelector((state) => state.reservation);
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCare = selectedOptions.find(o => o.categoryName === 'FabricCare');

  useEffect(() => {
    const fetchFabricCare = async () => {
      try {
        const data = await reservationService.getInventoryByCategory('FabricCare');
        setItems(data);
      } catch (error) {
        console.error('Error fetching fabric care:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFabricCare();
  }, []);

  const handleSelect = (item: InventoryItem) => {
    dispatch(toggleOption({
      inventoryId: item._id,
      name: item.name,
      price: item.isDefault ? 0 : item.unitPrice,
      categoryName: 'FabricCare'
    }));
  };

  const handleNext = () => {
    if (selectedCare) {
      dispatch(nextStep());
      router.push('/(protected)/(customer)/reservation/stain-removal');
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
        style={[commonStyles.primaryButton, !selectedCare && { opacity: 0.5 }]} 
        onPress={handleNext}
        disabled={!selectedCare}
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
        <Text style={commonStyles.title}>Fabric Care</Text>
        <Text style={commonStyles.subtitle}>
          Select a softener or conditioner to keep your clothes feeling fresh.
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <View style={styles.scrollContent}>
            {items.map((item) => {
              const isSelected = selectedCare?.inventoryId === item._id;
              return (
                <TouchableOpacity 
                  key={item._id}
                  style={[
                    styles.itemCard,
                    isSelected && styles.itemCardActive
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, isSelected && { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
                    <Wind size={24} color={isSelected ? COLORS.PRIMARY : COLORS.TEXT_MUTED} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, isSelected && { color: COLORS.PRIMARY }]}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
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

export default FabricCareScreen;

import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Sparkles } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleOption, nextStep, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/Detergents.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { InventoryItem } from '../../../types/reservation.types';

const DetergentsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedOptions } = useAppSelector((state) => state.reservation);
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDetergent = selectedOptions.find(o => o.categoryName === 'Detergent');

  useEffect(() => {
    const fetchDetergents = async () => {
      try {
        const data = await reservationService.getInventoryByCategory('Detergent');
        setItems(data);
      } catch (error) {
        console.error('Error fetching detergents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetergents();
  }, []);

  const handleSelect = (item: InventoryItem) => {
    dispatch(toggleOption({
      inventoryId: item._id,
      name: item.name,
      price: item.isDefault ? 0 : item.unitPrice,
      categoryName: 'Detergent'
    }));
  };

  const handleNext = () => {
    if (selectedDetergent) {
      dispatch(nextStep());
      router.push('/(protected)/(customer)/reservation/fabric-care');
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const isSelected = selectedDetergent?.inventoryId === item._id;
    return (
      <TouchableOpacity 
        style={[
          styles.card,
          isSelected && styles.cardActive
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
           <View style={[styles.imagePlaceholder, isSelected && { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
              <Sparkles size={24} color={isSelected ? COLORS.PRIMARY : COLORS.TEXT_MUTED} />
           </View>
           
           <View style={styles.info}>
              <Text style={[styles.name, isSelected && { color: COLORS.PRIMARY }]}>{item.name}</Text>
              <Text style={styles.description}>{item.description || 'Gentle cleaning for your clothes.'}</Text>
              
              <View style={styles.priceRow}>
                 <Text style={styles.priceText}>
                    {item.isDefault ? 'Included Free' : `+ Rs.${item.unitPrice.toFixed(2)}`}
                 </Text>
                 {item.isDefault && (
                    <View style={styles.defaultBadge}>
                       <Text style={styles.defaultBadgeText}>Standard</Text>
                    </View>
                 )}
              </View>
           </View>

           <View style={[styles.radio, isSelected && styles.radioActive]}>
              {isSelected && <Check size={14} color={COLORS.WHITE} />}
           </View>
        </View>
      </TouchableOpacity>
    );
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
        style={[commonStyles.primaryButton, !selectedDetergent && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={!selectedDetergent}
      >
        <Text style={commonStyles.primaryButtonText}>Select and Continue</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      footer={footer}
      scroll={false}
    >
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Detergent Preference</Text>
        <Text style={commonStyles.subtitle}>
          Choose the detergent that matches your laundry needs.
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default DetergentsScreen;

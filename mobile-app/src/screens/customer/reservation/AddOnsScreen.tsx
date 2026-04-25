import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, PlusCircle } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import AppHeader from '../../../components/common/AppHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleOption, prevStep } from '../../../store/slices/customer/reservation.slice';
import { COLORS } from '../../../theme/colors';
import { commonStyles } from './styles/common.styles';
import styles from './styles/AddOns.styles';
import { reservationService } from '../../../services/customer/reservationService';
import { InventoryItem } from '../../../types/reservation.types';

const AddOnsScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedOptions } = useAppSelector((state) => state.reservation);

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddOns = async () => {
            try {
                const data = await reservationService.getInventoryByCategory('AddOns');
                setItems(data);
            } catch (error) {
                console.error('Error fetching add-ons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddOns();
    }, []);

    const handleSelect = (item: InventoryItem) => {
        dispatch(toggleOption({
            inventoryId: item._id,
            name: item.name,
            price: item.isDefault ? 0 : item.unitPrice,
            categoryName: 'AddOns'
        }));
    };

    const header = (
        <AppHeader
            title="Extra Add-ons"
            onBackPress={() => router.back()}
        />
    );

    const footer = (
        <View style={commonStyles.footer}>
            <TouchableOpacity
                style={commonStyles.primaryButton}
                onPress={() => router.back()}
            >
                <Text style={commonStyles.primaryButtonText}>Apply Selections</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: InventoryItem }) => {
        const isSelected = selectedOptions.some(o => o.inventoryId === item._id);
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isSelected && styles.cardActive
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.8}
            >
                <View style={[styles.iconBox, isSelected && { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
                    <PlusCircle size={24} color={isSelected ? COLORS.PRIMARY : COLORS.TEXT_MUTED} />
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, isSelected && { color: COLORS.PRIMARY }]}>{item.name}</Text>
                    <Text style={styles.price}>
                        {item.isDefault ? 'Included Free' : `+ Rs.${(item.unitPrice || 0).toFixed(2)}`}
                    </Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <Check size={14} color={COLORS.WHITE} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper
            header={header}
            footer={footer}
            scroll={false}
        >
            <View style={commonStyles.container}>
                <Text style={commonStyles.subtitle}>
                    Enhance your laundry experience with these extra services. Select as many as you need.
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
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

export default AddOnsScreen;

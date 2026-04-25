import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, CreditCard, ShieldCheck, Trash2 } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Loading from '../../../components/common/Loading';
import { COLORS } from '../../../theme/colors';
import { paymentService } from '../../../services/customer/paymentService';
import { notify } from '../../../utils/notify';
import api from '../../../services/api';

const SavedCardsScreen = () => {
    const router = useRouter();
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getSavedCards();
            setCards(data);
        } catch (error: any) {
            console.error('Failed to load cards', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: string) => {
        notify.confirm(
            'Delete Card',
            'Are you sure you want to remove this card?',
            async () => {
                try {
                    setDeletingId(id);
                    await api.delete(`/payments/cards/${id}`);
                    setCards(prev => prev.filter(c => c._id !== id));
                    notify.success('Success', 'Card removed successfully');
                } catch (error: any) {
                    notify.error('Error', error.response?.data?.message || 'Failed to delete card');
                } finally {
                    setDeletingId(null);
                }
            },
            'Delete'
        );
    };

    const header = (
        <View style={cardStyles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY }}>Saved Cards</Text>
                </View>
            </View>
        </View>
    );

    const renderCard = ({ item }: { item: any }) => (
        <View style={cardStyles.cardItem}>
            <View style={cardStyles.cardContent}>
                <View style={[cardStyles.cardIconBox, { backgroundColor: getCardColor(item.brand) }]}>
                    <CreditCard size={28} color={COLORS.WHITE} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={cardStyles.cardBrand}>{item.brand} •••• {item.last4}</Text>
                        {item.isDefault && (
                            <View style={cardStyles.defaultBadge}>
                                <Text style={cardStyles.defaultBadgeText}>DEFAULT</Text>
                            </View>
                        )}
                    </View>
                    <Text style={cardStyles.cardExpiry}>Expires {item.expiryMonth}/{item.expiryYear}</Text>
                </View>
                <TouchableOpacity
                    style={cardStyles.deleteButton}
                    onPress={() => handleDeleteCard(item._id)}
                    disabled={deletingId === item._id}
                >
                    {deletingId === item._id ? (
                        <ActivityIndicator size="small" color={COLORS.ERROR} />
                    ) : (
                        <Trash2 size={20} color={COLORS.TEXT_MUTED} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const getCardColor = (brand: string) => {
        switch (brand.toLowerCase()) {
            case 'visa': return '#1a1f71';
            case 'mastercard': return '#eb001b';
            case 'amex': return '#007bc1';
            default: return COLORS.PRIMARY;
        }
    };

    if (loading) return <Loading fullScreen message="Loading your secure wallet..." />;

    return (
        <ScreenWrapper
            header={header}
            style={{ backgroundColor: '#F8FAFC' }}
        >
            <View style={{ padding: 20, flex: 1 }}>
                {/* Security Badge */}
                <View style={cardStyles.securityNote}>
                    <ShieldCheck size={20} color={COLORS.SUCCESS} />
                    <Text style={cardStyles.securityNoteText}>Your card details are encrypted and stored securely by PayHere.</Text>
                </View>

                {/* Card List */}
                {cards.length > 0 ? (
                    <FlatList
                        data={cards}
                        renderItem={renderCard}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={cardStyles.emptyContainer}>
                        <CreditCard size={80} color={COLORS.TEXT_MUTED} />
                        <Text style={cardStyles.emptyText}>No saved cards yet.</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={cardStyles.primaryAddButton}
                    onPress={() => router.push('/(protected)/(customer)/wallet/add-card')}
                >
                    <Plus size={20} color={COLORS.WHITE} />
                    <Text style={cardStyles.primaryAddButtonText}>Add New Payment Method</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const cardStyles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    addIconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F0F9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    securityNoteText: {
        color: '#166534',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    cardItem: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    cardIconBox: {
        width: 56,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBrand: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
    },
    cardExpiry: {
        fontSize: 13,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 2,
    },
    defaultBadge: {
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.PRIMARY,
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 60,
    },
    emptyText: {
        marginTop: 20,
        color: COLORS.TEXT_MUTED,
        fontSize: 16,
        fontWeight: '500',
    },
    primaryAddButton: {
        backgroundColor: COLORS.PRIMARY,
        padding: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 20,
        gap: 8,
    },
    primaryAddButtonText: {
        color: COLORS.WHITE,
        fontWeight: '800',
        fontSize: 16,
    }
});

export default SavedCardsScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SOFTENERS = [
  { id: '1', name: 'Comfort Fabric Softener', brand: 'Comfort', type: 'Liquid', isDefault: true },
  { id: '2', name: 'Downy Ultra', brand: 'Downy', type: 'Liquid', isDefault: false },
  { id: '3', name: 'Softlan Ultra', brand: 'Softlan', type: 'Liquid', isDefault: false },
  { id: '4', name: 'Snuggle Plus', brand: 'Snuggle', type: 'Liquid', isDefault: false },
];

const FabricCareScreen = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('1'); // Default to Comfort

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleContinue = () => {
    // Navigate to next screen (Finishing or Summary)
    router.push('/(protected)/(customer)/reservation/ReservationSummaryScreen');
  };

  const renderItem = ({ item }: { item: typeof SOFTENERS[0] }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        selectedId === item.id && styles.selectedCard
      ]}
      onPress={() => handleSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.info}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemType}>{item.type}</Text>
        </View>
        <View style={[styles.checkbox, selectedId === item.id && styles.checkboxActive]}>
          {selectedId === item.id && <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />}
        </View>
      </View>
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>DEFAULT</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Fabric Care</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Choose your preferred fabric softener. Comfort is used as default.</Text>
        
        <FlatList
          data={SOFTENERS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Review Reservation</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.WHITE,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginVertical: 20,
    lineHeight: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    position: 'relative',
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY_SOFT,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  defaultBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  defaultText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  continueText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FabricCareScreen;

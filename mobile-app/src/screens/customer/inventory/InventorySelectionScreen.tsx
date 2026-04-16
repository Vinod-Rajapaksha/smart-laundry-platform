import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Brand {
  id: string;
  name: string;
  image?: string;
}

const DETERGENTS: Brand[] = [
  { id: '1', name: 'Surf Excel (Default)' },
  { id: '2', name: 'Ariel' },
  { id: '3', name: 'Rin' },
  { id: '4', name: 'Sunlight' },
];

const SOFTENERS: Brand[] = [
  { id: '1', name: 'Comfort (Default)' },
  { id: '2', name: 'Softlan' },
  { id: '3', name: 'Downy' },
];

const InventorySelectionScreen = () => {
  const [selectedDetergent, setSelectedDetergent] = useState(DETERGENTS[0].id);
  const [selectedSoftener, setSelectedSoftener] = useState(SOFTENERS[0].id);

  const renderSelectionGroup = (
    title: string, 
    options: Brand[], 
    selectedId: string, 
    onSelect: (id: string) => void,
    icon: string
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color={COLORS.PRIMARY} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedId === option.id && styles.selectedCard
            ]}
            onPress={() => onSelect(option.id)}
          >
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                selectedId === option.id && styles.radioOuterActive
              ]}>
                {selectedId === option.id && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={[
              styles.optionText,
              selectedId === option.id && styles.selectedOptionText
            ]}>
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Washing Preferences</Text>
          <Text style={styles.subtitle}>Choose your preferred detergent and fabric softener for your next wash.</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>
            We use high-quality default brands unless you specify otherwise.
          </Text>
        </View>

        {renderSelectionGroup(
          "Detergent Brand", 
          DETERGENTS, 
          selectedDetergent, 
          setSelectedDetergent,
          "flask-outline"
        )}

        {renderSelectionGroup(
          "Fabric Softener", 
          SOFTENERS, 
          selectedSoftener, 
          setSelectedSoftener,
          "water-outline"
        )}

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 6,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY_SOFT,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    backgroundColor: COLORS.WHITE,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    elevation: 1,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
  },
  radioContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.PRIMARY,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InventorySelectionScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_CONFIG } from '../../../constants/api';

interface InventoryItem {
  itemId: string;
  name: string;
  category: string;
  stock: string;
  threshold: string;
}

const InventoryScreen = () => {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/inventory`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const getStockStatus = (stockStr: string, thresholdStr: string) => {
    const stock = parseFloat(stockStr);
    const threshold = parseFloat(thresholdStr);
    if (stock <= 0) return { label: 'OUT OF STOCK', color: COLORS.ERROR };
    if (stock <= threshold) return { label: 'LOW STOCK', color: COLORS.WARNING };
    return { label: 'IN STOCK', color: COLORS.SUCCESS };
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const status = getStockStatus(item.stock, item.threshold);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        
        <View style={styles.stockDetails}>
          <View style={styles.stockInfo}>
            <Text style={styles.label}>Current Stock</Text>
            <Text style={styles.value}>{item.stock}</Text>
          </View>
          <View style={styles.stockInfo}>
            <Text style={styles.label}>Threshold</Text>
            <Text style={styles.value}>{item.threshold}</Text>
          </View>
          <TouchableOpacity 
            style={styles.restockButton}
            onPress={() => {/* Navigate to restock modal/screen */}}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.restockText}>Restock</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Management</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.TEXT_PRIMARY} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: COLORS.PRIMARY_SOFT }]}>
          <Text style={styles.statLabel}>Total Items</Text>
          <Text style={styles.statValue}>{items.length}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
          <Text style={styles.statLabel}>Low Stock</Text>
          <Text style={[styles.statValue, { color: COLORS.WARNING }]}>
            {items.filter(i => parseFloat(i.stock) <= parseFloat(i.threshold)).length}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={60} color={COLORS.BORDER} />
              <Text style={styles.emptyText}>No inventory items found</Text>
            </View>
          }
        />
      )}
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  notificationBtn: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ERROR,
    borderWidth: 1.5,
    borderColor: COLORS.WHITE,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stockDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  stockInfo: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  restockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  restockText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
  },
});

export default InventoryScreen;

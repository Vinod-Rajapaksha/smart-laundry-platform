import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { router, usePathname } from 'expo-router';
import { apiFetch } from '../../../services/apiFetch';


const statsConfig = [
  { key: 'totalOrders', label: 'TOTAL ORDERS', icon: 'shopping-bag', color: '#2176FF', bg: '#E6F0FF' },
  { key: 'totalCustomers', label: 'TOTAL CUSTOMERS', icon: 'person', color: '#6C7A89', bg: '#F5F7FA' },
  { key: 'pendingOrders', label: 'PENDING ORDERS', icon: 'pending-actions', color: '#B68900', bg: '#FFF8E1' },
  { key: 'completed', label: 'COMPLETED', icon: 'check-circle', color: '#3CB371', bg: '#F0FFF0' },
];

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const usage = [
  { label: 'WASHING', value: 45.2, color: '#2176FF' },
  { label: 'DRY CLEAN', value: 32.8, color: '#3C4858' },
  { label: 'PRESSING', value: 22.0, color: '#B0BEC5' },
];

export default function StaffHomeScreen() {
  const [stats, setStats] = useState({
    totalOrders: null,
    totalCustomers: null,
    pendingOrders: null,
    completed: null, // Placeholder if you want to add completed orders
  });
  const [revenueData, setRevenueData] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  // Profile modal state removed; navigation will be used instead
  const pathname = usePathname();


  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiFetch('/data/dashboard')
      .then((data) => {
        console.log('Dashboard API data:', data);
        if (isMounted) {
          setStats({
            totalOrders: data.data.totalOrders,
            totalCustomers: data.data.totalCustomers,
            pendingOrders: data.data.pendingOrders,
            completed: null, // Set this if your API returns completed orders
          });
          if (Array.isArray(data.data.monthlyRevenue)) {
            setRevenueData(data.data.monthlyRevenue);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError('Failed to load dashboard stats');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["top", "right", "bottom", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#2176FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Portal</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/(protected)/(staff)/(tabs)/profile')}>
          <Ionicons name="person-circle" size={36} color="#2176FF" />
        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.performanceLabel}>PERFORMANCE OVERVIEW</Text>
        <Text style={styles.pageTitle}>System Analysis</Text>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statsCol}>
            {/* Total Orders */}
            <View style={[styles.statCard, { backgroundColor: statsConfig[0].bg }]}> 
              <FontAwesome name="shopping-bag" size={24} color={statsConfig[0].color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: statsConfig[0].color }]}>
                {loading ? '...' : error ? '-' : stats.totalOrders ?? 0}
              </Text>
              <Text style={styles.statLabel}>{statsConfig[0].label}</Text>
            </View>
            {/* Pending Orders */}
            <View style={[styles.statCard, { backgroundColor: statsConfig[2].bg }]}> 
              <MaterialIcons name="pending-actions" size={24} color={statsConfig[2].color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: statsConfig[2].color }]}>
                {loading ? '...' : error ? '-' : stats.pendingOrders ?? 0}
              </Text>
              <Text style={styles.statLabel}>{statsConfig[2].label}</Text>
            </View>
          </View>
          <View style={styles.statsCol}>
            {/* Total Customers */}
            <View style={[styles.statCard, { backgroundColor: statsConfig[1].bg }]}> 
              <Ionicons name="person" size={24} color={statsConfig[1].color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: statsConfig[1].color }]}>
                {loading ? '...' : error ? '-' : stats.totalCustomers ?? 0}
              </Text>
              <Text style={styles.statLabel}>{statsConfig[1].label}</Text>
            </View>
            {/* Completed Orders (placeholder) */}
            <View style={[styles.statCard, { backgroundColor: statsConfig[3].bg }]}> 
              <MaterialIcons name="check-circle" size={24} color={statsConfig[3].color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: statsConfig[3].color }]}>13</Text>
              <Text style={styles.statLabel}>{statsConfig[3].label}</Text>
            </View>
          </View>
        </View>
        {/* Revenue Analytics */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <Text style={styles.analyticsTitle}>Revenue Analytics</Text>
          </View>
          <Text style={styles.analyticsSubtitle}>Last 12 Months Performance</Text>
          <View style={styles.barChartRow}>
            {(() => {
              const MAX_BAR_HEIGHT = 80;
              const maxRevenue = Math.max(...revenueData, 1); // Avoid division by zero
              return revenueData.map((val, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.barChartCol}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMonth(idx)}
                >
                  {selectedMonth === idx && (
                    <Text style={styles.revenueValue}>{val}</Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: idx === 5 ? '#2176FF' : '#3FA0F6' },
                      { height: (val / maxRevenue) * MAX_BAR_HEIGHT },
                      selectedMonth === idx && styles.barSelected
                    ]}
                  />
                  <Text style={styles.barLabel}>{months[idx]}</Text>
                </TouchableOpacity>
              ));
            })()}
          </View>
        </View>
        
        {/* Financial Analysis Button */}
        <TouchableOpacity style={styles.financialBtn}>
          <Ionicons name="stats-chart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.financialBtnText}>Financial Analysis</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
      {/* Bottom Navigation */}
      {/* Bottom nav bar removed, now handled by shared layout */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2176FF',
  },
  profileIcon: {
    borderWidth: 2,
    borderColor: '#E6F0FF',
    borderRadius: 20,
    padding: 2,
    backgroundColor: '#E6F0FF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 80,
  },
  performanceLabel: {
    color: '#7B8AAB',
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: '500',
    marginBottom: 2,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statCard: {
    borderRadius: 18,
    margin: 6,
    padding: 18,
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#7B8AAB',
    fontWeight: '500',
    textAlign: 'center',
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analyticsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  analyticsGrowth: {
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  analyticsGrowthText: {
    color: '#2176FF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  analyticsSubtitle: {
    color: '#7B8AAB',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 2,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 2,
  },
  barChartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 12,
    backgroundColor: '#3FA0F6', // Default blue for bars
    borderRadius: 6,
    marginBottom: 4,
  },
  barActive: {
    backgroundColor: '#2176FF', // Darker blue for active bar
  },
  barLabel: {
    fontSize: 10,
    color: '#7B8AAB',
    marginTop: 2,
  },
  revenueValue: {
    fontSize: 12,
    color: '#2176FF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  barSelected: {
    borderWidth: 2,
    borderColor: '#2176FF',
  },
  usageCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  usageTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutMock: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#2176FF',
    borderRightColor: '#3C4858',
    borderBottomColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  donutText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  donutSub: {
    fontSize: 12,
    color: '#7B8AAB',
    fontWeight: '500',
  },
  usageList: {
    flex: 1,
    justifyContent: 'center',
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  usageLabel: {
    fontSize: 14,
    color: '#222',
    flex: 1,
  },
  usageValue: {
    fontSize: 14,
    color: '#7B8AAB',
    fontWeight: 'bold',
  },
  financialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2176FF',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  financialBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F1F3',
    paddingVertical: 6,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    // highlight active tab
  },
  navLabel: {
    fontSize: 12,
    color: '#B0BEC5',
    fontWeight: 'bold',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#2176FF',
  },
});

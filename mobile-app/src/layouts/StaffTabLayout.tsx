import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router, Slot } from 'expo-router';

export default function StaffTabLayout() {
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cash" size={22} color={pathname.includes('/finance') ? '#2176FF' : '#B0BEC5'} />
          <Text style={[styles.navLabel, pathname.includes('/finance') && styles.navLabelActive]}>FINANCE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(protected)/(staff)/(tabs)/reports')}
        >
          <Ionicons name="document-text" size={22} color={pathname.includes('/reports') ? '#2176FF' : '#B0BEC5'} />
          <Text style={[styles.navLabel, pathname.includes('/reports') && styles.navLabelActive]}>REPORTS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(protected)/(staff)/(tabs)/users')}
        >
          <Ionicons name="people" size={22} color={pathname.includes('/users') ? '#2176FF' : '#B0BEC5'} />
          <Text style={[styles.navLabel, pathname.includes('/users') && styles.navLabelActive]}>STAFF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(protected)/(staff)/(tabs)/home')}>
          <Ionicons name="bar-chart" size={22} color={pathname.includes('/home') ? '#2176FF' : '#B0BEC5'} />
          <Text style={[styles.navLabel, pathname.includes('/home') && styles.navLabelActive]}>SYSTEM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F1F3',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navLabel: {
    fontSize: 11,
    color: '#7B8AAB',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#2176FF',
    fontWeight: 'bold',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserStorage } from '../../../services/storage';

type User = {
  name: string;
  role: string;
  email: string;
  telephone?: string;
  address?: string;
};

export default function StaffProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserStorage().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2176FF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No user info found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarWrap}>
        <Ionicons name="person-circle" size={80} color="#2176FF" />
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.role}>{user.role}</Text>
      <View style={styles.infoBlock}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      {user.telephone && (
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user.telephone}</Text>
        </View>
      )}
      {user.address && (
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{user.address}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  avatarWrap: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2176FF',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#7B8AAB',
    marginBottom: 16,
  },
  infoBlock: {
    width: '100%',
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
    color: '#7B8AAB',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

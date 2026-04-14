
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '../../../../src/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

//   // Dummy avatar if none

  // Example: get member since from user.createdAt or fallback

  const handleLogout = () => {
    // Add your logout logic here
    Alert.alert('Logout', 'You have been logged out.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.profileTitle}>Profile</Text>
      <Text style={styles.name}>{user?.name || 'User'}</Text>
      <View style={styles.statusBadge}><Text style={styles.statusText}>ACTIVE</Text></View>

      <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>PERSONAL DETAILS</Text></View>
      <View style={styles.detailCard}><Text style={styles.detailLabel}>NAME</Text><Text style={styles.detailValue}>{user?.name}</Text></View>
      <View style={styles.detailCard}><Text style={styles.detailLabel}>EMAIL ADDRESS</Text><Text style={styles.detailValue}>{user?.email}</Text></View>
      <View style={styles.detailCard}><Text style={styles.detailLabel}>TELEPHONE</Text><Text style={styles.detailValue}>{user?.telephone}</Text></View>

      <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>SETTINGS</Text></View>
      <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/(protected)/(customer)/profile/edit-profile')}>
        <Text style={styles.settingsText}>Edit Profile</Text>
        <Text style={styles.settingsArrow}>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout from Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 0,
		backgroundColor: '#fff',
		alignItems: 'center',
		paddingBottom: 32,
	},
	profileTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 32,
		marginBottom: 16,
		textAlign: 'center',
	},
	name: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 4,
	},
	statusBadge: {
		backgroundColor: '#1E5EFF',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 2,
		alignSelf: 'center',
		marginBottom: 4,
	},
	statusText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 12,
		letterSpacing: 1,
	},
	sectionHeader: {
		width: '90%',
		marginTop: 18,
		marginBottom: 8,
	},
	sectionHeaderText: {
		color: '#222',
		fontWeight: 'bold',
		fontSize: 13,
		letterSpacing: 1,
	},
	detailCard: {
		width: '90%',
		backgroundColor: '#F7F9FB',
		borderRadius: 12,
		padding: 16,
		marginBottom: 10,
		flexDirection: 'column',
		elevation: 1,
	},
	detailLabel: {
		color: '#888',
		fontSize: 12,
		marginBottom: 2,
	},
	detailValue: {
		color: '#222',
		fontWeight: 'bold',
		fontSize: 15,
	},
	settingsRow: {
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		justifyContent: 'space-between',
	},
	settingsText: {
		color: '#222',
		fontSize: 16,
	},
	settingsArrow: {
		color: '#888',
		fontSize: 18,
		fontWeight: 'bold',
	},
	logoutBtn: {
		width: '90%',
		marginTop: 32,
		borderWidth: 1,
		borderColor: '#FF3B30',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	logoutText: {
		color: '#FF3B30',
		fontWeight: 'bold',
		fontSize: 16,
	},
});


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../../../services/apiFetch';
import { getAccessToken } from '../../../services/storage';

type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
	createdAt: string;
	isActive: boolean;
};

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = await getAccessToken();
				console.log('DEBUG: Access token used for users fetch:', token);
				const result = await apiFetch('/users?limit=20', {
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				});
								// Debug: log the full API response
								console.log('DEBUG: Users API response:', result);
								// Handle nested {data: {data: [...]}}
								const usersArray = Array.isArray(result?.data?.data)
									? result.data.data
									: Array.isArray(result?.data)
									? result.data
									: Array.isArray(result)
									? result
									: [];
								setUsers(usersArray);
			} catch (err: any) {
				const message = err?.message || 'Failed to fetch users';
				setError(message);
				Alert.alert('Error', message);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fc' }}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Manage Customers</Text>
				<Text style={styles.subtitle}>Manage all your customers here!</Text>
				<View style={styles.tableWrap}>
					<View style={styles.tableHeader}>
						<Text style={[styles.th, { flex: 1.2 }]}>USER ID</Text>
						<Text style={[styles.th, { flex: 2 }]}>NAME</Text>
						<Text style={[styles.th, { flex: 2.5 }]}>EMAIL</Text>
						<Text style={[styles.th, { flex: 1.5 }]}>ROLE</Text>
						<Text style={[styles.th, { flex: 2 }]}>JOINED DATE</Text>
						<Text style={[styles.th, { flex: 1.2 }]}>STATUS</Text>
					</View>
					{loading ? (
						<ActivityIndicator size="large" color="#3FA0F6" style={{ marginTop: 40 }} />
					) : (
						users.map((user) => (
							<View key={user._id} style={styles.tableRow}>
								<Text style={[styles.td, { flex: 1.2, color: '#2563eb', textDecorationLine: 'underline' }]}>CU - {user._id.slice(-4)}</Text>
								<Text style={[styles.td, { flex: 2 }]}>{user.name}</Text>
								<Text style={[styles.td, { flex: 2.5 }]}>{user.email}</Text>
								<Text style={[styles.td, { flex: 1.5 }]}>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</Text>
								<Text style={[styles.td, { flex: 2 }]}>{user.createdAt?.slice(0, 10).split('-').reverse().join('/')}</Text>
								<Text style={[styles.td, { flex: 1.2, color: user.isActive ? '#22c55e' : '#d32f2f', fontWeight: 'bold' }]}>
									{user.isActive ? '● Active' : '● Inactive'}
								</Text>
							</View>
						))
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 18,
		paddingBottom: 40,
		backgroundColor: '#f8f9fc',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#222',
		marginBottom: 2,
		marginTop: 8,
	},
	subtitle: {
		color: '#7B8AAB',
		fontSize: 15,
		marginBottom: 18,
	},
	tableWrap: {
		backgroundColor: '#fff',
		borderRadius: 18,
		padding: 10,
		marginBottom: 18,
		shadowColor: '#000',
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 1,
	},
	tableHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#e5e7eb',
		paddingBottom: 8,
		marginBottom: 6,
	},
	th: {
		fontWeight: 'bold',
		fontSize: 13,
		color: '#222',
	},
	tableRow: {
		flexDirection: 'row',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: '#f1f5f9',
		alignItems: 'center',
	},
	td: {
		fontSize: 13,
		color: '#222',
	},
});

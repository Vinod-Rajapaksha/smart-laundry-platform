import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../../../src/hooks/useAuth';
import api from '../../../../src/services/api';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from '../../../../src/store';
import { setUser } from "../../../../src/store/slices/auth.slice";
// If you need to use AuthState as a type, import it like this:
// import type { AuthState } from "../../../../src/store/slices/auth.slice";
import { fetchUserById } from "../../../../src/services/user";
import { AuthUser } from '../../../../src/types/auth.types';
// import type { AuthState } from "../../../../src/store/slices/auth.slice";

export default function EditProfileScreen() {
	const { user } = useAuth();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [form, setForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		telephone: user?.telephone || '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (key: 'name' | 'email' | 'telephone' | 'password', value: string) => {
		setForm({ ...form, [key]: value });
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			const userId = user?._id || user?.id;
			if (!userId) throw new Error('User ID not found');
			const payload: { name: string; email: string; telephone: string; password?: string } = { ...form };
			if (!payload.password) delete payload.password;
			await api.put(`/users/${userId}`, payload);

			// Fetch updated user and update store
			const updatedUser = await fetchUserById(userId);
			dispatch(setUser(updatedUser));

			Alert.alert('Success', 'Profile updated successfully');
			router.push('../../(tabs)/profile');
		} catch (err) {
			const errorMessage =
				(err as any)?.response?.data?.message ||
				(err as Error).message ||
				'Failed to update profile';
			Alert.alert('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<View style={styles.headerRow}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
					<Text style={{ fontSize: 22 }}>{'←'}</Text>
				</TouchableOpacity>
				<Text style={styles.title}>Edit Profile</Text>
			</View>
			<View style={styles.avatarContainer}>
				{/* <Image source={{ uri: avatarUrl }} style={styles.avatar} /> */}
			</View>
			<Text style={styles.name}>{user?.name || 'User'}</Text>
			<Text style={styles.status}>Active</Text>

			<View style={styles.formGroup}>
				<Text style={styles.label}>FULL NAME</Text>
				<TextInput
					style={styles.input}
					value={form.name}
					onChangeText={text => handleChange('name', text)}
					placeholder="Full Name"
				/>
			</View>
			<View style={styles.formGroup}>
				<Text style={styles.label}>EMAIL ADDRESS</Text>
				<TextInput
					style={styles.input}
					value={form.email}
					onChangeText={text => handleChange('email', text)}
					placeholder="Email Address"
					keyboardType="email-address"
					autoCapitalize="none"
				/>
			</View>
			<View style={styles.formGroup}>
				<Text style={styles.label}>TELEPHONE</Text>
				<TextInput
					style={styles.input}
					value={form.telephone}
					onChangeText={text => handleChange('telephone', text)}
					placeholder="Telephone"
					keyboardType="phone-pad"
				/>
			</View>
			<View style={styles.formGroup}>
				<Text style={styles.label}>PASSWORD</Text>
				<View style={styles.passwordRow}>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						value={form.password}
						onChangeText={text => handleChange('password', text)}
						placeholder="Password"
						secureTextEntry={!showPassword}
					/>
					<TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
						<Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
				<Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Changes  ✓'}</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
       container: {
	       flexGrow: 1,
	       backgroundColor: '#fff',
	       alignItems: 'center',
	       paddingBottom: 32,
	       paddingHorizontal: 0,
       },
	backBtn: {
		marginRight: 8,
		padding: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		flex: 1,
		textAlign: 'center',
		marginRight: 32,
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: 8,
		width: '100%',
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
		borderWidth: 2,
		borderColor: '#eee',
	},
	name: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 2,
	},
	status: {
		color: '#888',
		fontSize: 14,
		marginBottom: 16,
		textAlign: 'center',
	},
	formGroup: {
		width: '90%',
		marginBottom: 14,
	},
	label: {
		color: '#888',
		fontSize: 12,
		marginBottom: 4,
		marginLeft: 4,
		fontWeight: 'bold',
	},
	input: {
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
		backgroundColor: '#F7F9FB',
	},
	passwordRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	eyeBtn: {
		marginLeft: 8,
		padding: 8,
	},
	saveBtn: {
		width: '90%',
		backgroundColor: '#1E5EFF',
		borderRadius: 24,
		paddingVertical: 16,
		alignItems: 'center',
		marginTop: 18,
	},
	saveBtnText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 18,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		marginTop: 32,
		marginBottom: 8,
		paddingHorizontal: 16,
	},
});




function dispatch(arg0: { payload: AuthUser; type: "auth/setUser"; }) {
	throw new Error('Function not implemented.');
}


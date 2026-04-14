

import React from 'react';
import { useAuth } from '../../../../src/hooks/useAuth';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { COLORS } from '../../../../src/theme/colors';
import { SPACING } from '../../../../src/theme/spacing';
import { TYPOGRAPHY } from '../../../../src/theme/typography';
import { useRouter } from 'expo-router';


const services = [
	{ key: '1', title: 'Wash', desc: 'Professional washing & folding' },
	{ key: '2', title: 'Dry Clean', desc: 'Gentle dry cleaning for delicates' },
	{ key: '3', title: 'Ironing', desc: 'Crisp ironing & finishing' },
	{ key: '4', title: 'Express Laundry', desc: 'Same-day wash & delivery' },
];

const pros = [
	{ key: '1', name: 'James K.', rating: 4.9 },
	{ key: '2', name: 'Sarah L.', rating: 5.0 },
	{ key: '3', name: 'Mark T.', rating: 4.8 },
];

export default function HomeScreen() {
   const { user } = useAuth();
   const router = useRouter();
   return (
	   <SafeAreaView style={styles.container}>
		   {/* Header */}
		   <View style={styles.header}>
			   <View style={styles.headerTitleWrapper}>
				   <Text style={styles.headerTitle}>B & W Laundry Services</Text>
			   </View>
		   </View>

		   <ScrollView showsVerticalScrollIndicator={false}>
			   {/* Welcome Section */}
			   <View style={styles.welcomeSection}>
				   <Text style={styles.welcomeTitle}>
					   {`Welcome ${user?.name || 'Customer'}!`}
				   </Text>
				   <Text style={styles.welcomeSubtitle}>Your concierge is ready to assist.</Text>
			   </View>

			   {/* Promo Card
			   <View style={styles.promoCard}>
				   <View style={styles.badge}><Text style={styles.badgeText}>SUMMER SPECIAL</Text></View>
				   <Text style={styles.promoTitle}>Professional{"\n"}AC Deep Cleaning</Text>
				   <Text style={styles.promoDesc}>Breathe purer air with our expert sanitization service.</Text>
				   <TouchableOpacity style={styles.promoButton}>
					   <Text style={styles.promoButtonText}>Book Now</Text>
				   </TouchableOpacity>
			   </View> */}

			   {/* Service Catalog */}
			   <View style={styles.sectionRow}>
				   <Text style={styles.sectionTitle}>Service Catalog</Text>
				   <TouchableOpacity><Text style={styles.sectionAction}>View All</Text></TouchableOpacity>
			   </View>
			   <View style={styles.serviceGrid}>
				   {services.map(service => (
					   <View key={service.key} style={styles.serviceCard}>
						   <Text style={styles.serviceTitle}>{service.title}</Text>
						   <Text style={styles.serviceDesc}>{service.desc}</Text>
					   </View>
				   ))}
			   </View>

			   {/* Book a Pro */}
			   <View style={styles.bookProCard}>
				   <Text style={styles.bookProTitle}>Can’t find what you need?</Text>
				   <Text style={styles.bookProDesc}>Tell us your requirements and we will match you with a verified professional in minutes.</Text>
				   <TouchableOpacity style={styles.bookProButton}>
					   <Text style={styles.bookProButtonText}>+  Book a Pro</Text>
				   </TouchableOpacity>
			   </View>

			   {/* Top Rated Pros */}
			   <Text style={styles.sectionTitle}>Top Rated Pros</Text>
			   <FlatList
				   data={pros}
				   horizontal
				   showsHorizontalScrollIndicator={false}
				   keyExtractor={item => item.key}
				   style={{ marginTop: SPACING.LG }}
				   contentContainerStyle={{ paddingHorizontal: SPACING.SCREEN_HORIZONTAL }}
				   renderItem={({ item }) => (
					   <View style={styles.proCard}>
						   <Text style={styles.proName}>{item.name}</Text>
						   <View style={styles.proRatingRow}>
							   <Text style={styles.starIcon}>★</Text>
							   <Text style={styles.proRating}>{item.rating}</Text>
						   </View>
					   </View>
				   )}
			   />
			   <View style={{ height: SPACING.SCREEN_VERTICAL + 40 }} />
		   </ScrollView>

		   {/* Bottom Tab Bar Placeholder */}
		   <View style={styles.tabBar}>
			   <TouchableOpacity style={styles.tabItem}>
				   <Text style={styles.tabIconActive}>🏠</Text>
				   <Text style={styles.tabLabelActive}>Home</Text>
			   </TouchableOpacity>
			   <TouchableOpacity style={styles.tabItem}>
				   <Text style={styles.tabIcon}>🛒</Text>
				   <Text style={styles.tabLabel}>Orders</Text>
			   </TouchableOpacity>
			   <TouchableOpacity style={styles.tabItem}>
				   <Text style={styles.tabIcon}>💰</Text>
				   <Text style={styles.tabLabel}>Wallet</Text>
			   </TouchableOpacity>
			   <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(protected)/(customer)/(tabs)/profile')}>
				   <Text style={styles.avatar}>👤</Text>
				   <Text style={styles.tabLabel}>Profile</Text>
			   </TouchableOpacity>
		   </View>
	   </SafeAreaView>
   );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND,
	},
	   header: {
		   flexDirection: 'row',
		   alignItems: 'center',
		   justifyContent: 'center',
		   paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
		   paddingTop: 48,
		   paddingBottom: 16,
		   backgroundColor: COLORS.WHITE,
		   borderBottomWidth: 1,
		   borderBottomColor: COLORS.BORDER_LIGHT,
		   position: 'relative',
	   },
	   headerTitleWrapper: {
		   position: 'absolute',
		   left: 0,
		   right: 0,
		   alignItems: 'center',
		   justifyContent: 'center',
		   pointerEvents: 'none',
	   },
	menuIcon: {
		width: 28,
		height: 28,
		resizeMode: 'contain',
	},
	headerTitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_MD,
		color: COLORS.PRIMARY,
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: COLORS.BORDER_LIGHT,
	},
	welcomeSection: {
		paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
		paddingTop: SPACING.SCREEN_VERTICAL,
		paddingBottom: SPACING.LG,
	},
	welcomeTitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_SM,
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 2,
	},
	welcomeSubtitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
		color: COLORS.TEXT_SECONDARY,
	},
	promoCard: {
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 18,
		marginHorizontal: SPACING.SCREEN_HORIZONTAL,
		padding: 22,
		marginBottom: SPACING.SECTION_LG,
	},
	badge: {
		alignSelf: 'flex-start',
		backgroundColor: COLORS.SECONDARY,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginBottom: 10,
	},
	badgeText: {
		color: COLORS.WHITE,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.SM,
		letterSpacing: 1,
	},
	promoTitle: {
		color: COLORS.WHITE,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
		fontSize: 22,
		marginBottom: 6,
		marginTop: 2,
		lineHeight: 30,
	},
	promoDesc: {
		color: COLORS.WHITE,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
		marginBottom: 18,
	},
	promoButton: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 8,
		alignSelf: 'flex-start',
		paddingHorizontal: 18,
		paddingVertical: 8,
	},
	promoButtonText: {
		color: COLORS.PRIMARY,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
	},
	sectionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
		marginTop: SPACING.SECTION_SM,
		marginBottom: 8,
	},
	sectionTitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.XL,
		color: COLORS.TEXT_PRIMARY,
	},
	sectionAction: {
		color: COLORS.PRIMARY,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
	},
	serviceGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
		marginBottom: SPACING.SECTION_MD,
	},
	serviceCard: {
		width: '47%',
		backgroundColor: COLORS.CARD,
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
		alignItems: 'center',
		shadowColor: COLORS.BLACK,
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 2,
	},
	serviceIcon: {
		width: 36,
		height: 36,
		marginBottom: 10,
		resizeMode: 'contain',
	},
	serviceTitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.LG,
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 2,
		textAlign: 'center',
	},
	serviceDesc: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
		fontSize: TYPOGRAPHY.FONT_SIZE.SM,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
	},
	bookProCard: {
		backgroundColor: COLORS.CARD,
		borderRadius: 18,
		marginHorizontal: SPACING.SCREEN_HORIZONTAL,
		padding: 22,
		marginBottom: SPACING.SECTION_LG,
		alignItems: 'center',
	},
	bookProTitle: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.XL,
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 6,
		textAlign: 'center',
	},
	bookProDesc: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
		color: COLORS.TEXT_SECONDARY,
		marginBottom: 18,
		textAlign: 'center',
	},
	bookProButton: {
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 8,
		paddingHorizontal: 28,
		paddingVertical: 12,
	},
	bookProButtonText: {
		color: COLORS.WHITE,
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
	},
	proCard: {
		width: 110,
		backgroundColor: COLORS.CARD,
		borderRadius: 14,
		padding: 12,
		marginRight: 14,
		alignItems: 'center',
		shadowColor: COLORS.BLACK,
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 2,
	},
	proImage: {
		width: 54,
		height: 54,
		borderRadius: 12,
		marginBottom: 8,
		resizeMode: 'cover',
	},
	proName: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.MD,
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 2,
		textAlign: 'center',
	},
	proRatingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	starIcon: {
		width: 14,
		height: 14,
		marginRight: 2,
		resizeMode: 'contain',
	},
	proRating: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.SM,
		color: COLORS.WARNING,
	},
	tabBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: COLORS.WHITE,
		borderTopWidth: 1,
		borderTopColor: COLORS.BORDER_LIGHT,
		paddingVertical: 8,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 64,
		zIndex: 10,
	},
	tabItem: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	tabIcon: {
		width: 26,
		height: 26,
		tintColor: COLORS.TEXT_MUTED,
		marginBottom: 2,
		resizeMode: 'contain',
	},
	tabIconActive: {
		width: 26,
		height: 26,
		tintColor: COLORS.PRIMARY,
		marginBottom: 2,
		resizeMode: 'contain',
	},
	tabLabel: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
		fontSize: TYPOGRAPHY.FONT_SIZE.SM,
		color: COLORS.TEXT_MUTED,
	},
	tabLabelActive: {
		fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
		fontSize: TYPOGRAPHY.FONT_SIZE.SM,
		color: COLORS.PRIMARY,
	},
});

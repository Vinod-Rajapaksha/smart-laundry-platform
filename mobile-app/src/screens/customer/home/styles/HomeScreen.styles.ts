import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../../theme/colors';
import { TYPOGRAPHY } from '../../../../theme/typography';

const { width } = Dimensions.get('window');

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
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.WHITE,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarFallbackText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
  },
  welcomeText: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trackingCard: {
    marginTop: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 24,
    // Premium Shadow
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  trackingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  trackButton: {
    flex: 1,
    marginRight: 12,
  },
  infoButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 100, // Space for the reservation button
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  reservationButton: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  }
});

export default styles;

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../../theme/colors';

const { width } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    marginTop: 32,
  },
  footer: {
    padding: 24,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  primaryButton: {
    height: 56,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  stepDot: {
    height: 4,
    width: 24,
    borderRadius: 2,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  stepDotActive: {
    backgroundColor: COLORS.PRIMARY,
  },
});

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../../theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContainer: {
    padding: 20,
  },
  voucherCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  leftSection: {
    width: 100,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  discountText: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '800',
  },
  offText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
  },
  rightSection: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  voucherDesc: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 6,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  applyButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  appliedText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  dashedLine: {
    width: 1,
    height: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 1,
  },
  // Redeem styles
  inputContainer: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    margin: 20,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  redeemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  redeemDesc: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
  }
});

export default styles;

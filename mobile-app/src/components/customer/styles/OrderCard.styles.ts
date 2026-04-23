import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  trackButton: {
    backgroundColor: COLORS.PRIMARY_SOFT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  trackButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  reviewButton: {
    backgroundColor: '#F0FDF4', // Greenish
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  reviewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  viewReviewButton: {
    backgroundColor: '#EFF6FF', // Blueish
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewReviewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});

export default styles;

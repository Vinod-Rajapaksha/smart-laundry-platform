import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../theme/colors';
import { TYPOGRAPHY } from '../../../../theme/typography';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 24,
  },
  // Order Summary Styles
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vendorName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  vendorSubtitle: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  voucherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_SOFT,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_OUTLINE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  voucherText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  priceBreakdown: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  priceValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
  },
  // Selection Card Styles
  selectionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectionCardActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.PRIMARY,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
  },
  selectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectionContent: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  selectionDesc: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  // Bank Details
  bankDetailBox: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  // Transfer Slip Area
  uploadArea: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  uploadTitle: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 4,
  },
  uploadDesc: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_MUTED,
  },
  // Payment Status
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.SUCCESS_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusMessage: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  receiptCard: {
    width: '100%',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  }
});

export default styles;

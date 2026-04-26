import { StyleSheet } from "react-native";
import { COLORS } from "../../../../theme/colors";
import { TYPOGRAPHY } from "../../../../theme/typography";

export const registerStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },

  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  strengthWrapper: {
    marginTop: 10,
    paddingHorizontal: 4,
  },

  strengthBars: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },

  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },

  strengthBarActive: {
    backgroundColor: COLORS.PRIMARY,
  },

  strengthBarInactive: {
    backgroundColor: COLORS.BORDER,
  },

  strengthText: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 0.5,
  },

  inlineErrorText: {
    marginTop: 6,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.ERROR_TEXT,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
    marginBottom: 18,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    marginTop: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },

  termsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_TERTIARY,
  },

  linkText: {
    color: COLORS.PRIMARY,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
  },

  infoBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.INFO_BACKGROUND,
    borderRadius: 16,
    padding: 14,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
});
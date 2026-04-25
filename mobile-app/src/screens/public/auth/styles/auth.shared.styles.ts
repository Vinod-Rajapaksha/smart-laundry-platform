import { StyleSheet } from "react-native";
import { COLORS } from "../../../../theme/colors";
import { SPACING } from "../../../../theme/spacing";
import { TYPOGRAPHY } from "../../../../theme/typography";

export const authSharedStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  keyboardWrapper: {
    flex: 1,
  },

  scrollContentCentered: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
    paddingVertical: SPACING.SCREEN_VERTICAL,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.SCREEN_HORIZONTAL,
    paddingVertical: SPACING.SCREEN_VERTICAL,
  },

  containerCentered: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.LOGO_BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE_LG,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.TITLE,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  forgotText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.PRIMARY,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SPACING.ROUNDED_MD,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    paddingHorizontal: 14,
  },

  leftIcon: {
    marginRight: 10,
  },

  rightIconButton: {
    paddingLeft: 10,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.XXL,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 14,
  },

  primaryButton: {
    minHeight: 56,
    borderRadius: SPACING.ROUNDED_MD,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XXL,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_ON_PRIMARY,
  },

  secondaryButton: {
    minHeight: 54,
    borderRadius: SPACING.ROUNDED_MD,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_OUTLINE,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  secondaryButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SEMIBOLD,
    color: COLORS.BORDER_DARK,
  },

  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },

  errorBox: {
    backgroundColor: COLORS.ERROR_BACKGROUND,
    borderColor: COLORS.ERROR_BORDER,
  },

  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.ERROR_TEXT,
  },

  successBox: {
    backgroundColor: COLORS.SUCCESS_BACKGROUND,
    borderColor: COLORS.SUCCESS_BORDER,
  },

  successText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.SUCCESS_TEXT,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
  },

  dividerText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.TEXT_MUTED,
    letterSpacing: TYPOGRAPHY.LETTER_SPACING.WIDE,
  },

  bottomRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },

  bottomLink: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.BOLD,
    color: COLORS.PRIMARY,
  },

  footerChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "center",
    backgroundColor: COLORS.PRIMARY_SOFT,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_SOFT_BORDER,
    borderRadius: SPACING.PILL,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },

  footerChipText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
});
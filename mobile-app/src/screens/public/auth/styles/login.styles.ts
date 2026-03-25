import { StyleSheet } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const loginStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.TAB_BACKGROUND,
    borderRadius: 18,
    padding: 4,
    marginBottom: 24,
  },

  tabButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  activeTabButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_TERTIARY,
  },

  activeTabButtonText: {
    color: COLORS.WHITE,
  },
});
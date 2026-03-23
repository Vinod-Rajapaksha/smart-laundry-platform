import { router } from "expo-router";

export const redirectByRole = (role?: string | null) => {
  const normalizedRole = role?.toUpperCase();

  if (normalizedRole === "CUSTOMER") {
    router.replace("/(protected)/(customer)/(tabs)/home");
    return;
  }

  if (normalizedRole === "STAFF" || normalizedRole === "ADMIN") {
    router.replace("/(protected)/(staff)/(tabs)/home");
    return;
  }

  router.replace("/(public)/auth/login");
};
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import { restoreSession } from "../src/store/slices/auth.slice";

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).finally(() => {
      setIsReady(true);
    });
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === "STAFF" || user.role === "ADMIN") {
      return <Redirect href="/(protected)/(staff)/(tabs)/home" />;
    }
    return <Redirect href="/(protected)/(customer)/(tabs)/home" />;
  }

  return <Redirect href="/(public)/auth/login" />;
}
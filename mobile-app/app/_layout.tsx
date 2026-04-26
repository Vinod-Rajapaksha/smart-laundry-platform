import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { NotificationWrapper } from "../src/components/notifications/NotificationWrapper";

import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { ActivityIndicator, View } from "react-native";

import Toast from 'react-native-toast-message';
import { Provider as PaperProvider } from 'react-native-paper';
import { AlertProvider } from '../src/context/AlertContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <AlertProvider>
          <NotificationWrapper>
            <Stack screenOptions={{ headerShown: false }} />
          </NotificationWrapper>
        </AlertProvider>
      </PaperProvider>
      <Toast />
    </Provider>
  );
}
import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="restock" options={{ title: 'Restock Item' }} />
    </Stack>
  );
}

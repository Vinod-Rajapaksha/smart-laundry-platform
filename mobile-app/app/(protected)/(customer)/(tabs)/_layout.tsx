import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../../../src/theme/colors";

export default function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_MUTED,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopWidth: 1,
          borderTopColor: COLORS.BORDER_LIGHT,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarLabel: 'Preferences',
          tabBarIcon: ({ color, size }) => <Ionicons name="options" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

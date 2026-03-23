import React from "react";
import { Pressable, Text, View } from "react-native";
import { loginStyles } from "../styles/login.styles";

type LoginRoleTab = "customer" | "staff";

type Props = {
  activeTab: LoginRoleTab;
  onChange: (tab: LoginRoleTab) => void;
};

export default function AuthRoleTabs({ activeTab, onChange }: Props) {
  return (
    <View style={loginStyles.tabContainer}>
      <Pressable
        onPress={() => onChange("customer")}
        style={[
          loginStyles.tabButton,
          activeTab === "customer" && loginStyles.activeTabButton,
        ]}
      >
        <Text
          style={[
            loginStyles.tabButtonText,
            activeTab === "customer" && loginStyles.activeTabButtonText,
          ]}
        >
          Customer
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChange("staff")}
        style={[
          loginStyles.tabButton,
          activeTab === "staff" && loginStyles.activeTabButton,
        ]}
      >
        <Text
          style={[
            loginStyles.tabButtonText,
            activeTab === "staff" && loginStyles.activeTabButtonText,
          ]}
        >
          Staff
        </Text>
      </Pressable>
    </View>
  );
}
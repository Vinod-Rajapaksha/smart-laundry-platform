import React from "react";
import { Text, View } from "react-native";
import { registerStyles } from "../styles/register.styles";

type PasswordStrengthLabel = "NONE" | "WEAK" | "FAIR" | "GOOD" | "STRONG";

type Props = {
  score: number;
  label: PasswordStrengthLabel;
  hasPassword: boolean;
};

export default function PasswordStrength({
  score,
  label,
  hasPassword,
}: Props) {
  return (
    <View style={registerStyles.strengthWrapper}>
      <View style={registerStyles.strengthBars}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              registerStyles.strengthBar,
              score >= level
                ? registerStyles.strengthBarActive
                : registerStyles.strengthBarInactive,
            ]}
          />
        ))}
      </View>

      <Text style={registerStyles.strengthText}>
        {hasPassword ? `PASSWORD STRENGTH: ${label}` : "PASSWORD STRENGTH: NONE"}
      </Text>
    </View>
  );
}
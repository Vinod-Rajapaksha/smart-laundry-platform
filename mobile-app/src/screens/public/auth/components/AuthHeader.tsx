import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { COLORS } from "../../../../theme/colors";
import { authSharedStyles } from "../styles/auth.shared.styles";

type Props = {
  title: string;
  subtitle: string;
  icon?: "washing-machine" | "local-laundry-service";
};

export default function AuthHeader({
  title,
  subtitle,
  icon = "washing-machine",
}: Props) {
  return (
    <View style={authSharedStyles.header}>
      <View style={authSharedStyles.logoCircle}>
        {icon === "washing-machine" ? (
          <MaterialCommunityIcons
            name="washing-machine"
            size={28}
            color={COLORS.PRIMARY}
          />
        ) : (
          <MaterialIcons
            name="local-laundry-service"
            size={28}
            color={COLORS.PRIMARY}
          />
        )}
      </View>

      <Text style={authSharedStyles.title}>{title}</Text>
      <Text style={authSharedStyles.subtitle}>{subtitle}</Text>
    </View>
  );
}
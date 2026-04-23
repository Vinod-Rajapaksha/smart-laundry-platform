import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppDispatch } from "../../../../src/hooks/useAppDispatch";
import { useAppSelector } from "../../../../src/hooks/useAppSelector";
import { clearAuthError, loginUser } from "../../../../src/store/slices/auth.slice";
import { ROUTES } from "../../../../src/constants/routes";
import { COLORS } from "../../../../src/theme/colors";

import AuthHeader from "./components/AuthHeader";
import { authSharedStyles } from "./styles/auth.shared.styles";
import { loginStyles } from "./styles/login.styles";
import { validateLoginForm } from "./validation/login.validation";



export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const normalizedRole = useMemo(() => {
    if (!user?.role) return null;
    return String(user.role).toUpperCase();
  }, [user]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !normalizedRole) return;

    if (normalizedRole === "CUSTOMER") {
      router.replace(ROUTES.CUSTOMER_HOME);
      return;
    }

    if (normalizedRole === "STAFF" || normalizedRole === "ADMIN") {
      router.replace(ROUTES.STAFF_HOME);
    }
  }, [isAuthenticated, normalizedRole]);



  const handleLogin = async () => {
    dispatch(clearAuthError());

    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError("");

    const resultAction = await dispatch(
      loginUser({
        email: email.trim().toLowerCase(),
        password,
      } as any)
    );

    if (loginUser.rejected.match(resultAction)) {
      return;
    }
  };

  const displayError = localError || error || "";

  return (
    <SafeAreaView style={authSharedStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />

      <KeyboardAvoidingView
        style={authSharedStyles.keyboardWrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authSharedStyles.scrollContentCentered}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={loginStyles.card}>
            <AuthHeader
              title="Welcome Back"
              subtitle="Please enter your details to sign in"
              icon="washing-machine"
            />
            <View style={authSharedStyles.form}>
              <View style={authSharedStyles.inputGroup}>
                <Text style={authSharedStyles.label}>Email</Text>
                <View style={authSharedStyles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.TEXT_SECONDARY}
                    style={authSharedStyles.leftIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@gmail.com"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    style={authSharedStyles.input}
                  />
                </View>
              </View>

              <View style={authSharedStyles.inputGroup}>
                <View style={authSharedStyles.passwordHeader}>
                  <Text style={authSharedStyles.label}>Password</Text>
                  <Pressable onPress={() => router.push(ROUTES.AUTH_FORGOT_PASSWORD)}>
                    <Text style={authSharedStyles.forgotText}>Forgot Password?</Text>
                  </Pressable>
                </View>

                <View style={authSharedStyles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={20}
                    color={COLORS.TEXT_SECONDARY}
                    style={authSharedStyles.leftIcon}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    style={authSharedStyles.input}
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={authSharedStyles.rightIconButton}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={COLORS.TEXT_SECONDARY}
                    />
                  </Pressable>
                </View>
              </View>

              {!!displayError && (
                <View
                  style={[authSharedStyles.messageBox, authSharedStyles.errorBox]}
                >
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={18}
                    color={COLORS.ERROR_TEXT}
                  />
                  <Text style={authSharedStyles.errorText}>{displayError}</Text>
                </View>
              )}

              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                style={[
                  authSharedStyles.primaryButton,
                  isLoading && authSharedStyles.primaryButtonDisabled,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <Text style={authSharedStyles.primaryButtonText}>Login</Text>
                )}
              </Pressable>
            </View>

            <View style={authSharedStyles.dividerRow}>
              <View style={authSharedStyles.dividerLine} />
              <Text style={authSharedStyles.dividerText}>OR</Text>
              <View style={authSharedStyles.dividerLine} />
            </View>

            <Pressable
              style={authSharedStyles.secondaryButton}
              onPress={() => router.push(ROUTES.AUTH_REGISTER)}
            >
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={20}
                color={COLORS.BORDER_DARK}
              />
              <Text style={authSharedStyles.secondaryButtonText}>
                Register as Customer
              </Text>
            </Pressable>

            <View style={authSharedStyles.footerChip}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={14}
                color={COLORS.TEXT_SECONDARY}
              />
              <Text style={authSharedStyles.footerChipText}>
                Your data is securely protected.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} ``
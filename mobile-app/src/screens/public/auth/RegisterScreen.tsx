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
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppDispatch } from "../../../../src/hooks/useAppDispatch";
import { useAppSelector } from "../../../../src/hooks/useAppSelector";
import { clearAuthError, registerUser } from "../../../../src/store/slices/auth.slice";
import { ROUTES } from "../../../../src/constants/routes";
import { COLORS } from "../../../../src/theme/colors";

import AuthHeader from "./components/AuthHeader";
import PasswordStrength from "./components/PasswordStrength";
import { authSharedStyles } from "./styles/auth.shared.styles";
import { registerStyles } from "./styles/register.styles";
import { getPasswordStrength } from "./utils/passwordStrength";
import { validateRegisterForm } from "./validation/register.validation";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const handleRegister = async () => {
    dispatch(clearAuthError());
    setSuccessMessage("");

    const validationError = validateRegisterForm({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      agreeTerms,
    });

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError("");

    const payload = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      telephone: phone.trim(),
      password,
      role: "CUSTOMER",
    };

    const resultAction = await dispatch(registerUser(payload as any));

    if (registerUser.rejected.match(resultAction)) {
      return;
    }

    setSuccessMessage("Registration successful. Please login to continue.");

    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setAgreeTerms(false);

    setTimeout(() => {
      router.replace(ROUTES.AUTH_LOGIN);
    }, 1200);
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
          contentContainerStyle={authSharedStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authSharedStyles.containerCentered}>
            <View style={registerStyles.card}>
              <AuthHeader
                title="Register"
                subtitle="Join us to manage your laundry services"
                icon="local-laundry-service"
              />

              <View style={authSharedStyles.form}>
                <View style={authSharedStyles.inputGroup}>
                  <Text style={authSharedStyles.label}>Full Name</Text>
                  <View style={authSharedStyles.inputWrapper}>
                    <Feather
                      name="user"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                      style={authSharedStyles.leftIcon}
                    />
                    <TextInput
                      style={authSharedStyles.input}
                      placeholder="Full Name"
                      placeholderTextColor={COLORS.TEXT_MUTED}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>
                </View>

                <View style={authSharedStyles.inputGroup}>
                  <Text style={authSharedStyles.label}>Email</Text>
                  <View style={authSharedStyles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                      style={authSharedStyles.leftIcon}
                    />
                    <TextInput
                      style={authSharedStyles.input}
                      placeholder="name@gmail.com"
                      placeholderTextColor={COLORS.TEXT_MUTED}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={authSharedStyles.inputGroup}>
                  <Text style={authSharedStyles.label}>Phone</Text>
                  <View style={authSharedStyles.inputWrapper}>
                    <Feather
                      name="phone"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                      style={authSharedStyles.leftIcon}
                    />
                    <TextInput
                      style={authSharedStyles.input}
                      placeholder="07X XXX XXXX"
                      placeholderTextColor={COLORS.TEXT_MUTED}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                <View style={authSharedStyles.inputGroup}>
                  <Text style={authSharedStyles.label}>Password</Text>
                  <View style={authSharedStyles.inputWrapper}>
                    <Feather
                      name="lock"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                      style={authSharedStyles.leftIcon}
                    />
                    <TextInput
                      style={authSharedStyles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.TEXT_MUTED}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={authSharedStyles.rightIconButton}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={18}
                        color={COLORS.TEXT_SECONDARY}
                      />
                    </Pressable>
                  </View>

                  <PasswordStrength
                    score={strength.score}
                    label={strength.label}
                    hasPassword={!!password}
                  />
                </View>

                <View style={authSharedStyles.inputGroup}>
                  <Text style={authSharedStyles.label}>Confirm Password</Text>
                  <View style={authSharedStyles.inputWrapper}>
                    <Feather
                      name="shield"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                      style={authSharedStyles.leftIcon}
                    />
                    <TextInput
                      style={authSharedStyles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.TEXT_MUTED}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      style={authSharedStyles.rightIconButton}
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={18}
                        color={COLORS.TEXT_SECONDARY}
                      />
                    </Pressable>
                  </View>

                  {!passwordsMatch && (
                    <Text style={registerStyles.inlineErrorText}>
                      Passwords do not match
                    </Text>
                  )}
                </View>

                <Pressable
                  style={registerStyles.termsRow}
                  onPress={() => setAgreeTerms((prev) => !prev)}
                >
                  <View
                    style={[
                      registerStyles.checkbox,
                      agreeTerms && registerStyles.checkboxChecked,
                    ]}
                  >
                    {agreeTerms && <Feather name="check" size={12} color="#fff" />}
                  </View>

                  <Text style={registerStyles.termsText}>
                    I agree to the{" "}
                    <Text style={registerStyles.linkText}>Terms & Conditions</Text>
                    {" "}and{" "}
                    <Text style={registerStyles.linkText}>Privacy Policy</Text>.
                  </Text>
                </Pressable>

                {!!displayError && (
                  <View
                    style={[authSharedStyles.messageBox, authSharedStyles.errorBox]}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color={COLORS.ERROR_TEXT}
                    />
                    <Text style={authSharedStyles.errorText}>{displayError}</Text>
                  </View>
                )}

                {!!successMessage && (
                  <View
                    style={[
                      authSharedStyles.messageBox,
                      authSharedStyles.successBox,
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color={COLORS.SUCCESS_TEXT}
                    />
                    <Text style={authSharedStyles.successText}>
                      {successMessage}
                    </Text>
                  </View>
                )}

                <Pressable
                  style={[
                    authSharedStyles.primaryButton,
                    isLoading && authSharedStyles.primaryButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.WHITE} />
                  ) : (
                    <Text style={authSharedStyles.primaryButtonText}>
                      Register
                    </Text>
                  )}
                </Pressable>

                <View style={registerStyles.infoBox}>
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={COLORS.TEXT_SECONDARY}
                    style={{ marginTop: 1 }}
                  />
                  <Text style={registerStyles.infoText}>
                    Staff accounts are created by the system administrator. If you
                    are an employee, please contact your manager.
                  </Text>
                </View>
              </View>
            </View>

            <View style={authSharedStyles.bottomRow}>
              <Text style={authSharedStyles.bottomText}>
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push(ROUTES.AUTH_LOGIN)}>
                <Text style={authSharedStyles.bottomLink}>Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
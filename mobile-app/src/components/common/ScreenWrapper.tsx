import React from 'react';
import {
  View,
  StatusBar,
  Platform,
  ScrollView,
  ViewStyle,
  StatusBarStyle,
  RefreshControlProps,
  KeyboardAvoidingView,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  statusBarColor?: string;
  barStyle?: StatusBarStyle;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  withKeyboardAvoidingView?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  contentContainerStyle,
  scroll = false,
  statusBarColor = COLORS.BACKGROUND,
  barStyle = 'dark-content',
  header,
  footer,
  refreshControl,
  withKeyboardAvoidingView = false,
  keyboardShouldPersistTaps = 'handled',
}) => {
  const Container = scroll ? ScrollView : View;

  const content = (
    <Container
      style={{ flex: 1 }}
      contentContainerStyle={scroll ? [{ flexGrow: 1 }, contentContainerStyle] : undefined}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      {...(scroll ? { keyboardShouldPersistTaps } : {})}
    >
      {children}
    </Container>
  );

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.BACKGROUND }, style]}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} translucent />
      {header}
      {withKeyboardAvoidingView ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
      {footer}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

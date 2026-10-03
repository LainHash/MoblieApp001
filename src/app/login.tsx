import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('alex.morgan@artisankitchen.com');
  const [password, setPassword] = useState('CulinaryArt2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="arrow_back" size={20} color={ArtisanColors.onSurfaceVariant} />
        </Pressable>

        <View style={styles.brandBadge}>
          <Icon name="restaurant" size={18} color={ArtisanColors.primary} fill />
          <Text style={styles.brandBadgeText}>Artisan Kitchen</Text>
        </View>

        <Pressable
          accessibilityLabel="Trợ giúp"
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="help_outline" size={20} color={ArtisanColors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Editorial Ambient Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgePill}>
            <View style={styles.pulseDot} />
            <Text style={styles.badgeText}>Đặc quyền thành viên</Text>
          </View>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subTitle}>
            Chào mừng bạn quay trở lại với hành trình ẩm thực tinh hoa
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Username / Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email hoặc Số điện thoại</Text>
            <View style={styles.inputWrap}>
              <Icon name="mail" size={20} color={ArtisanColors.outline} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="example@artisankitchen.com"
                placeholderTextColor={ArtisanColors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Icon name="lock" size={20} color={ArtisanColors.outline} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}>
                <Icon
                  name={showPassword ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={ArtisanColors.outline}
                />
              </Pressable>
            </View>
          </View>

          {/* Options: Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberWrap}>
              <View style={[styles.checkBox, rememberMe && styles.checkBoxActive]}>
                {rememberMe && <Icon name="check_circle" size={14} color="#ffffff" fill />}
              </View>
              <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
            </Pressable>

            <Pressable>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </Pressable>
          </View>

          {/* Primary Submit CTA */}
          <Pressable
            accessibilityRole="button"
            onPress={handleLogin}
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}>
            <Text style={styles.submitBtnText}>Đăng nhập</Text>
            <Icon name="arrow_forward" size={18} color="#ffffff" />
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Quick Login */}
          <View style={styles.socialGrid}>
            <Pressable style={styles.socialBtn}>
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialBtnText}>Apple ID</Text>
            </Pressable>

            <Pressable style={styles.socialBtn}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.socialBtnText}>Google ID</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer Link to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Chưa có tài khoản?</Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.signupText}>Đăng ký ngay</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ArtisanColors.surface,
    ...Platform.select({
      web: {
        maxWidth: 520,
        width: '100%',
        marginHorizontal: 'auto' as any,
        minHeight: '100vh' as any,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(227, 190, 181, 0.3)',
      },
    }),
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainer,
  },
  brandBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroSection: {
    marginBottom: 20,
    gap: 6,
  },
  badgePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(236, 221, 216, 0.6)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.onSecondaryFixed,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainer,
    gap: 16,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  inputWrap: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceBright,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    padding: 0,
  },
  eyeBtn: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ArtisanColors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: {
    borderColor: ArtisanColors.primary,
    backgroundColor: ArtisanColors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: ArtisanColors.onSurfaceVariant,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: ArtisanColors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: ArtisanColors.primaryContainer,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: ArtisanColors.surfaceContainer,
  },
  dividerText: {
    fontSize: 11,
    color: ArtisanColors.outline,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceBright,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialIcon: {
    fontSize: 18,
    color: ArtisanColors.onSurface,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EA4335',
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: ArtisanColors.secondary,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});

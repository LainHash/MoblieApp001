import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';

export default function OtpScreen() {
  const [otp, setOtp] = useState(['4', '8', '2', '', '', '']);
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleKeyPress = (num: string) => {
    const nextEmptyIndex = otp.findIndex((val) => val === '');
    if (nextEmptyIndex !== -1) {
      const nextOtp = [...otp];
      nextOtp[nextEmptyIndex] = num;
      setOtp(nextOtp);
    }
  };

  const handleDelete = () => {
    const lastFilledIndex = [...otp].reverse().findIndex((val) => val !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = otp.length - 1 - lastFilledIndex;
      const nextOtp = [...otp];
      nextOtp[actualIndex] = '';
      setOtp(nextOtp);
    }
  };

  const handleVerify = () => {
    router.replace('/edit-profile');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="arrow_back" size={20} color={ArtisanColors.onSurface} />
        </Pressable>

        <View style={styles.securityBadge}>
          <Icon name="shield" size={15} color={ArtisanColors.primary} fill />
          <Text style={styles.securityBadgeText}>BẢO MẬT ĐA TẦNG</Text>
        </View>

        <Pressable
          accessibilityLabel="Trợ giúp"
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="help_outline" size={20} color={ArtisanColors.secondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Glow & Mail Icon Illustration */}
        <View style={styles.illustrationWrap}>
          <View style={styles.glowOuter}>
            <View style={styles.glowInner}>
              <Icon name="mark_email_read" size={36} color={ArtisanColors.primary} fill />
            </View>
            <View style={styles.lockBadge}>
              <Icon name="lock" size={12} color="#ffffff" fill />
            </View>
          </View>

          <Text style={styles.title}>Xác thực tài khoản</Text>
          <Text style={styles.subTitle}>
            Chúng tôi đã gửi mã xác thực 6 chữ số đến địa chỉ email:
          </Text>

          <View style={styles.emailPill}>
            <Icon name="mail" size={16} color={ArtisanColors.primary} />
            <Text style={styles.emailText}>alex.morgan@email.com</Text>
            <View style={styles.pillDot} />
            <Pressable onPress={() => router.back()}>
              <Text style={styles.changeEmailText}>Đổi email</Text>
            </Pressable>
          </View>
        </View>

        {/* 6 OTP Boxes */}
        <View style={styles.otpGrid}>
          {otp.map((digit, idx) => {
            const isFilled = digit !== '';
            const isActive = !isFilled && (idx === 0 || otp[idx - 1] !== '');

            return (
              <View
                key={idx}
                style={[
                  styles.otpBox,
                  isFilled && styles.otpBoxFilled,
                  isActive && styles.otpBoxActive,
                ]}>
                {isFilled ? (
                  <Text style={styles.otpDigit}>{digit}</Text>
                ) : isActive ? (
                  <View style={styles.cursor} />
                ) : (
                  <View style={styles.emptySlotDot} />
                )}
              </View>
            );
          })}
        </View>

        {/* Timer & Resend */}
        <View style={styles.timerSection}>
          {countdown > 0 ? (
            <Text style={styles.timerText}>
              Gửi lại mã sau <Text style={styles.timerHighlight}>{formatTimer(countdown)}</Text>
            </Text>
          ) : (
            <Pressable onPress={() => setCountdown(60)}>
              <Text style={styles.resendText}>Chưa nhận được mã? Gửi lại ngay</Text>
            </Pressable>
          )}
        </View>

        {/* Verify CTA Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleVerify}
          style={({ pressed }) => [styles.verifyBtn, pressed && styles.pressed]}>
          <Text style={styles.verifyBtnText}>Xác thực ngay</Text>
          <Icon name="arrow_forward" size={18} color="#ffffff" />
        </Pressable>

        {/* Numeric On-Screen Keypad for mobile ergonomics */}
        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(
            (key, index) => {
              if (key === '') {
                return <View key={index} style={styles.keypadItemEmpty} />;
              }

              if (key === 'del') {
                return (
                  <Pressable
                    key={key}
                    onPress={handleDelete}
                    style={({ pressed }) => [
                      styles.keypadItem,
                      pressed && styles.keypadPressed,
                    ]}>
                    <Icon name="backspace" size={20} color={ArtisanColors.onSurface} />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  style={({ pressed }) => [
                    styles.keypadItem,
                    pressed && styles.keypadPressed,
                  ]}>
                  <Text style={styles.keypadNum}>{key}</Text>
                </Pressable>
              );
            }
          )}
        </View>

        <View style={{ height: 20 }} />
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
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: ArtisanColors.secondaryContainer,
  },
  securityBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  glowOuter: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(173, 44, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  glowInner: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ArtisanColors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ArtisanColors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    marginTop: 4,
  },
  emailText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  pillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ArtisanColors.outlineVariant,
  },
  changeEmailText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  otpGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 18,
    justifyContent: 'center',
    width: '100%',
  },
  otpBox: {
    flex: 1,
    maxWidth: 48,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderColor: ArtisanColors.primary,
  },
  otpBoxActive: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderColor: ArtisanColors.primary,
    borderWidth: 2,
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: ArtisanColors.primary,
    borderRadius: 1,
  },
  emptySlotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(143, 112, 104, 0.4)',
  },
  timerSection: {
    marginBottom: 20,
  },
  timerText: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  timerHighlight: {
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  verifyBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  keypadItem: {
    width: '30%',
    height: 52,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.3)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  keypadItemEmpty: {
    width: '30%',
    height: 52,
    marginBottom: 10,
  },
  keypadNum: {
    fontSize: 20,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  keypadPressed: {
    backgroundColor: ArtisanColors.surfaceContainerLow,
    transform: [{ scale: 0.95 }],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

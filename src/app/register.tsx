import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useAuth } from '@/features/auth';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Thông báo', 'Vui lòng đồng ý với Điều khoản sử dụng & Chính sách bảo mật.');
      return;
    }

    try {
      await register({
        email: email.trim(),
        userName: username.trim(),
        password,
        confirmPassword,
      });

      Alert.alert(
        'Đăng ký thành công',
        'Mã OTP kích hoạt tài khoản đã được gửi đến email của bạn.',
        [
          {
            text: 'Nhập mã OTP',
            onPress: () =>
              router.push({
                pathname: '/otp',
                params: { email: email.trim() },
              }),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        'Đăng ký thất bại',
        err instanceof Error ? err.message : 'Vui lòng kiểm tra lại thông tin.'
      );
    }
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

        <View style={styles.brandBadge}>
          <Icon name="restaurant" size={16} color={ArtisanColors.primary} fill />
          <Text style={styles.brandBadgeText}>Artisan Kitchen</Text>
        </View>

        <View style={styles.langPill}>
          <Text style={styles.langText}>VN</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Welcome Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgePill}>
            <Icon name="stars" size={13} color={ArtisanColors.primary} fill />
            <Text style={styles.badgeText}>ĐẶC QUYỀN ẨM THỰC</Text>
          </View>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subTitle}>
            Trở thành thành viên Artisan Kitchen để nhận ưu đãi độc quyền và tích điểm thưởng trên mỗi bữa ăn.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          {/* Username */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <View style={styles.inputWrap}>
              <Icon name="alternate_email" size={19} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Ví dụ: alexmorgan99"
                placeholderTextColor={ArtisanColors.outline}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Địa chỉ email</Text>
            <View style={styles.inputWrap}>
              <Icon name="mail" size={19} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ten@vidu.com"
                placeholderTextColor={ArtisanColors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputWrap}>
              <Icon name="call" size={19} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0908 123 456"
                placeholderTextColor={ArtisanColors.outline}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Password with Strength Bar */}
          <View style={styles.fieldWrap}>
            <View style={styles.pwdHeaderRow}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.strengthRow}>
                <Icon name="check_circle" size={12} color={ArtisanColors.tertiary} fill />
                <Text style={styles.strengthText}>Độ bảo mật: Mạnh</Text>
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Icon name="lock" size={19} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Tối thiểu 8 ký tự"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}>
                <Icon
                  name={showPassword ? 'visibility_off' : 'visibility'}
                  size={19}
                  color={ArtisanColors.secondary}
                />
              </Pressable>
            </View>

            {/* 4 Green Strength Indicator Bars */}
            <View style={styles.strengthBarsRow}>
              <View style={styles.strengthBar} />
              <View style={styles.strengthBar} />
              <View style={styles.strengthBar} />
              <View style={styles.strengthBar} />
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Icon name="lock" size={19} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Agreement Checkbox */}
          <Pressable
            onPress={() => setAgreeTerms(!agreeTerms)}
            style={styles.termsRow}>
            <View style={[styles.checkBox, agreeTerms && styles.checkBoxActive]}>
              {agreeTerms && <Icon name="check_circle" size={14} color="#ffffff" fill />}
            </View>
            <Text style={styles.termsText}>
              Tôi đồng ý với <Text style={styles.termsLink}>Điều khoản sử dụng</Text> & <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            </Text>
          </Pressable>

          {/* Submit Button */}
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.submitBtn,
              isLoading && { opacity: 0.7 },
              pressed && styles.pressed,
            ]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Tiếp tục</Text>
                <Icon name="arrow_forward" size={18} color="#ffffff" />
              </>
            )}
          </Pressable>
        </View>

        {/* Footer Link to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Đã có tài khoản?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Đăng nhập ngay</Text>
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
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
  },
  brandBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: ArtisanColors.primaryFixed,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: ArtisanColors.onPrimaryFixed,
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
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(173, 44, 0, 0.1)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ArtisanColors.primary,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 14,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  fieldWrap: {
    gap: 6,
  },
  pwdHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  inputWrap: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
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
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: ArtisanColors.tertiary,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ArtisanColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkBoxActive: {
    borderColor: ArtisanColors.primary,
    backgroundColor: ArtisanColors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: ArtisanColors.secondary,
    lineHeight: 18,
  },
  termsLink: {
    color: ArtisanColors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: ArtisanColors.secondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

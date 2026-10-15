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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';
import { authService } from '@/features/auth';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  // Strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecial = /[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?!]/.test(newPassword);

  const passedCriteria = [hasMinLength, hasMixedCase, hasDigit, hasSpecial].filter(Boolean).length;
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!currentPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Thông báo', 'Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      Alert.alert(
        'Thành công',
        'Mật khẩu của bạn đã được cập nhật thành công.',
        [
          {
            text: 'Đồng ý',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        'Lỗi',
        err instanceof Error ? err.message : 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Icon name="arrow_back" size={24} color={ArtisanColors.onSurface} />
        </Pressable>

        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>

        <Pressable
          accessibilityLabel="Trợ giúp"
          onPress={() =>
            Alert.alert(
              'Trợ giúp bảo mật',
              'Nếu bạn quên mật khẩu hoặc nghi ngờ tài khoản bị xâm nhập, hãy liên hệ hotline CSKH Artisan Kitchen: 1900 8888.'
            )
          }
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Icon name="help_outline" size={22} color={ArtisanColors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Security Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Icon name="verified_user" size={24} color={ArtisanColors.primary} fill />
          </View>
          <View style={styles.heroTextBox}>
            <Text style={styles.heroTitle}>Cập nhật mật khẩu bảo mật</Text>
            <Text style={styles.heroDesc}>
              Mật khẩu mới của bạn cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để bảo vệ tài khoản hội viên.
            </Text>
          </View>
        </View>

        {/* Password Form */}
        <View style={styles.formContainer}>
          {/* Field 1: Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mật khẩu hiện tại <Text style={styles.reqStar}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <View style={styles.leadingIcon}>
                <Icon name="lock" size={20} color={ArtisanColors.onSurfaceVariant} />
              </View>
              <TextInput
                style={styles.inputField}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showCurrent}
              />
              <Pressable
                accessibilityLabel={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onPress={() => setShowCurrent(!showCurrent)}
                style={styles.trailingIconBtn}>
                <Icon
                  name={showCurrent ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={ArtisanColors.onSurfaceVariant}
                />
              </Pressable>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Quên mật khẩu',
                  'Chúng tôi sẽ gửi mã OTP xác nhận về số điện thoại đã đăng ký để hỗ trợ thiết lập lại mật khẩu.'
                )
              }
              style={styles.forgotRow}>
              <Text style={styles.forgotText}>Quên mật khẩu hiện tại?</Text>
              <Icon name="arrow_forward" size={14} color={ArtisanColors.primary} />
            </Pressable>
          </View>

          {/* Field 2: New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mật khẩu mới <Text style={styles.reqStar}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <View style={styles.leadingIcon}>
                <Icon name="lock_reset" size={20} color={ArtisanColors.onSurfaceVariant} />
              </View>
              <TextInput
                style={styles.inputField}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showNew}
              />
              <Pressable
                accessibilityLabel={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onPress={() => setShowNew(!showNew)}
                style={styles.trailingIconBtn}>
                <Icon
                  name={showNew ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={ArtisanColors.onSurfaceVariant}
                />
              </Pressable>
            </View>

            {/* Password Strength Meter */}
            <View style={styles.strengthMeterBox}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthTitle}>Độ mạnh mật khẩu:</Text>
                <View style={styles.strengthLevelRow}>
                  <View
                    style={[
                      styles.strengthDot,
                      {
                        backgroundColor:
                          passedCriteria <= 2
                            ? ArtisanColors.error
                            : passedCriteria === 3
                            ? ArtisanColors.primary
                            : ArtisanColors.tertiary,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.strengthLevelText,
                      {
                        color:
                          passedCriteria <= 2
                            ? ArtisanColors.error
                            : passedCriteria === 3
                            ? ArtisanColors.primary
                            : ArtisanColors.tertiary,
                      },
                    ]}>
                    {passedCriteria <= 2 ? 'Yếu' : passedCriteria === 3 ? 'Khá' : 'Rất mạnh'}
                  </Text>
                </View>
              </View>

              {/* 4 Segmented Bars */}
              <View style={styles.segmentsRow}>
                {[1, 2, 3, 4].map((seg) => {
                  const isActive = passedCriteria >= seg;
                  let barColor: string = ArtisanColors.surfaceContainerHigh;
                  if (isActive) {
                    barColor =
                      passedCriteria <= 2
                        ? ArtisanColors.error
                        : passedCriteria === 3
                        ? ArtisanColors.primary
                        : ArtisanColors.tertiary;
                  }
                  return (
                    <View
                      key={seg}
                      style={[
                        styles.segmentBar,
                        {
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Criteria Checklist */}
              <View style={styles.criteriaList}>
                <View style={styles.criteriaItem}>
                  <View
                    style={[
                      styles.checkCircle,
                      hasMinLength && styles.checkCircleActive,
                    ]}>
                    <Icon
                      name="check"
                      size={12}
                      color={hasMinLength ? ArtisanColors.tertiary : ArtisanColors.outline}
                    />
                  </View>
                  <Text
                    style={[
                      styles.criteriaText,
                      hasMinLength && styles.criteriaTextActive,
                    ]}>
                    Tối thiểu 8 ký tự
                  </Text>
                </View>

                <View style={styles.criteriaItem}>
                  <View
                    style={[
                      styles.checkCircle,
                      hasMixedCase && styles.checkCircleActive,
                    ]}>
                    <Icon
                      name="check"
                      size={12}
                      color={hasMixedCase ? ArtisanColors.tertiary : ArtisanColors.outline}
                    />
                  </View>
                  <Text
                    style={[
                      styles.criteriaText,
                      hasMixedCase && styles.criteriaTextActive,
                    ]}>
                    Có chứa chữ cái in hoa và in thường
                  </Text>
                </View>

                <View style={styles.criteriaItem}>
                  <View
                    style={[
                      styles.checkCircle,
                      hasDigit && styles.checkCircleActive,
                    ]}>
                    <Icon
                      name="check"
                      size={12}
                      color={hasDigit ? ArtisanColors.tertiary : ArtisanColors.outline}
                    />
                  </View>
                  <Text
                    style={[
                      styles.criteriaText,
                      hasDigit && styles.criteriaTextActive,
                    ]}>
                    Có ít nhất 1 chữ số (0-9)
                  </Text>
                </View>

                <View style={styles.criteriaItem}>
                  <View
                    style={[
                      styles.checkCircle,
                      hasSpecial && styles.checkCircleActive,
                    ]}>
                    <Icon
                      name="check"
                      size={12}
                      color={hasSpecial ? ArtisanColors.tertiary : ArtisanColors.outline}
                    />
                  </View>
                  <Text
                    style={[
                      styles.criteriaText,
                      hasSpecial && styles.criteriaTextActive,
                    ]}>
                    Có ký tự đặc biệt (@, #, $, !...)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Field 3: Confirm New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Xác nhận mật khẩu mới <Text style={styles.reqStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                isMatching && styles.inputWrapperSuccess,
              ]}>
              <View style={styles.leadingIcon}>
                <Icon
                  name={isMatching ? 'check_circle' : 'lock'}
                  size={20}
                  color={isMatching ? ArtisanColors.tertiary : ArtisanColors.onSurfaceVariant}
                />
              </View>
              <TextInput
                style={styles.inputField}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor={ArtisanColors.outline}
                secureTextEntry={!showConfirm}
              />
              <Pressable
                accessibilityLabel={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.trailingIconBtn}>
                <Icon
                  name={showConfirm ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={ArtisanColors.onSurfaceVariant}
                />
              </Pressable>
            </View>

            {isMatching && (
              <View style={styles.matchFeedbackRow}>
                <Icon name="task_alt" size={16} color={ArtisanColors.tertiary} />
                <Text style={styles.matchFeedbackText}>Mật khẩu hoàn toàn trùng khớp</Text>
              </View>
            )}
          </View>

          {/* Security Option: Sign out other devices */}
          <Pressable
            onPress={() => setLogoutOtherDevices(!logoutOtherDevices)}
            style={styles.checkboxCard}>
            <View
              style={[
                styles.checkboxBox,
                logoutOtherDevices && styles.checkboxBoxChecked,
              ]}>
              {logoutOtherDevices && (
                <Icon name="check" size={14} color="#ffffff" />
              )}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxTitle}>
                Đăng xuất khỏi tất cả các thiết bị khác sau khi đổi mật khẩu
              </Text>
              <Text style={styles.checkboxSub}>
                Khuyến nghị bật để đảm bảo an toàn tuyệt đối cho tài khoản ẩm thực & thẻ hội viên tích điểm.
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            isSubmitting && { opacity: 0.7 },
            pressed && styles.pressed,
          ]}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Icon name="lock_reset" size={20} color="#ffffff" />
              <Text style={styles.submitBtnText}>Xác nhận đổi mật khẩu</Text>
            </>
          )}
        </Pressable>

        <View style={styles.securityFootnote}>
          <Icon name="lock" size={13} color={ArtisanColors.tertiary} />
          <Text style={styles.securityFootnoteText}>
            Bảo mật chuẩn mã hóa SSL 256-bit Artisan Kitchen
          </Text>
        </View>
      </View>
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
      },
    }),
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ArtisanColors.outlineVariant,
    backgroundColor: ArtisanColors.surface,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(216, 194, 188, 0.4)',
    marginBottom: 20,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ArtisanColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBox: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    lineHeight: 20,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 13,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 18,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  reqStar: {
    color: ArtisanColors.primary,
  },
  inputWrapper: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ArtisanColors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputWrapperSuccess: {
    borderColor: ArtisanColors.tertiary,
    borderWidth: 1.5,
  },
  leadingIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: ArtisanColors.onSurface,
    paddingVertical: 8,
  },
  trailingIconBtn: {
    padding: 6,
  },
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  strengthMeterBox: {
    marginTop: 8,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 194, 188, 0.4)',
    gap: 10,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthTitle: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
  },
  strengthLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  strengthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  strengthLevelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: 6,
    height: 6,
  },
  segmentBar: {
    flex: 1,
    borderRadius: 3,
  },
  criteriaList: {
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ArtisanColors.outlineVariant,
    gap: 6,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ArtisanColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: 'rgba(56, 106, 33, 0.15)',
  },
  criteriaText: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
  },
  criteriaTextActive: {
    color: ArtisanColors.onSurface,
    fontWeight: '500',
  },
  matchFeedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingTop: 4,
  },
  matchFeedbackText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.tertiary,
  },
  checkboxCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ArtisanColors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: ArtisanColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: ArtisanColors.primary,
    borderColor: ArtisanColors.primary,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    lineHeight: 18,
  },
  checkboxSub: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 16,
    marginTop: 4,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 248, 245, 0.95)',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ArtisanColors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  securityFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 2,
  },
  securityFootnoteText: {
    fontSize: 11,
    color: ArtisanColors.onSurfaceVariant,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

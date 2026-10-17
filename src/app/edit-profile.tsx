import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useUserProfile } from '@/features/user';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, isLoading, updateProfile } = useUserProfile();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [address, setAddress] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function populate() {
      if (ignore) return;
      if (user) {
        if (user.userName) setUsername(user.userName);
        if (user.email) setEmail(user.email);
      }
      if (profile) {
        if (profile.firstName) setFirstName(profile.firstName);
        if (profile.lastName) setLastName(profile.lastName);
        if (profile.phone) setPhone(profile.phone);
        if (profile.dateOfBirth) setDob(profile.dateOfBirth);
        if (profile.address) setAddress(profile.address);
        if (profile.gender !== undefined) setGender(profile.gender ? 'male' : 'female');
      }
    }
    populate();
    return () => {
      ignore = true;
    };
  }, [user, profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        dateOfBirth: dob,
        gender: gender === 'male',
        address,
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        citizenCardId: '',
      });
      Alert.alert('Thành công', 'Thông tin cá nhân đã được lưu cập nhật.', [
        { text: 'Đồng ý', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(
        'Lỗi',
        err instanceof Error ? err.message : 'Không thể cập nhật thông tin lúc này.'
      );
    }
  };

  const handleChangePhone = () => {
    Alert.alert(
      'Đổi số điện thoại',
      'Mã OTP xác thực sẽ được gửi tới số điện thoại mới của bạn.'
    );
  };

  const handleUseCurrentLocation = () => {
    if (profile?.address) {
      setAddress(profile.address);
      Alert.alert('Vị trí', 'Đã tải địa chỉ hiện tại đã lưu của bạn.');
    } else {
      Alert.alert('Vị trí', 'Vui lòng nhập địa chỉ của bạn vào ô địa chỉ.');
    }
  };

  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topHeader}>
          <Pressable
            accessibilityLabel="Quay lại"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
            <Icon name="arrow_back" size={24} color={ArtisanColors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Chỉnh sửa thông tin cá nhân
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color={ArtisanColors.primary} />
          <Text style={{ fontSize: 14, color: ArtisanColors.secondary, fontWeight: '600' }}>
            Đang tải thông tin cá nhân...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Top Navigation Bar */}
      <View style={styles.topHeader}>
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Icon name="arrow_back" size={24} color={ArtisanColors.onSurface} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Chỉnh sửa thông tin cá nhân
        </Text>

        <Pressable
          accessibilityLabel="Hủy"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
          <Text style={styles.cancelBtnText}>Hủy</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 2. Avatar & Media Upload Card */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 40,
                  backgroundColor: ArtisanColors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#ffffff' }}>
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Thay đổi ảnh đại diện"
              onPress={() =>
                Alert.alert('Đổi ảnh đại diện', 'Tính năng đang được phát triển.')
              }
              style={styles.cameraBadgeBtn}>
              <Icon name="photo_camera" size={18} color="#ffffff" />
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert('Đổi ảnh đại diện', 'Chọn ảnh từ thư viện hoặc chụp ảnh mới.')
            }
            style={styles.changeAvatarTextBtn}>
            <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
            <Icon name="expand_circle_right" size={16} color={ArtisanColors.primary} />
          </Pressable>
          <Text style={styles.avatarHelperText}>Hỗ trợ định dạng JPG, PNG tối đa 5MB</Text>
        </View>

        {/* 3. Personal Details Form */}
        <View style={styles.formSection}>
          {/* Name Row: Họ & tên đệm + Tên */}
          <View style={styles.nameRow}>
            <View style={styles.lastNameCol}>
              <Text style={styles.label}>
                Họ & tên đệm <Text style={styles.reqStar}>*</Text>
              </Text>
              <TextInput
                style={styles.inputField}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nguyễn Hoàng"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
            <View style={styles.firstNameCol}>
              <Text style={styles.label}>
                Tên <Text style={styles.reqStar}>*</Text>
              </Text>
              <TextInput
                style={styles.inputField}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Minh"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
          </View>

          {/* Tên hiển thị / Username (Cố định) */}
          <View style={styles.formGroup}>
            <View style={styles.labelWithBadgeRow}>
              <Text style={styles.label}>Tên hiển thị / Username</Text>
              <View style={styles.fixedBadge}>
                <Icon name="lock" size={12} color={ArtisanColors.onSurfaceVariant} />
                <Text style={styles.fixedBadgeText}>Cố định</Text>
              </View>
            </View>
            <View style={[styles.inputWrapper, styles.readOnlyInputWrapper]}>
              <Text style={styles.usernamePrefix}>@</Text>
              <TextInput
                style={[styles.inputField, styles.readOnlyInputField]}
                value={username}
                editable={false}
              />
              <Icon name="verified_user" size={18} color={ArtisanColors.onSurfaceVariant} />
            </View>
            <Text style={styles.fieldHelperText}>
              Tên tài khoản dùng để nhận dạng trong các buổi Workshop và Bếp mở.
            </Text>
          </View>

          {/* Email with "Đã xác minh" chip */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Địa chỉ Email <Text style={styles.reqStar}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Icon name="mail" size={20} color={ArtisanColors.onSurfaceVariant} />
              <TextInput
                style={[styles.inputField, { paddingRight: 8 }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.verifiedChip}>
                <Icon name="check_circle" size={14} color={ArtisanColors.tertiary} fill />
                <Text style={styles.verifiedChipText}>Đã xác minh</Text>
              </View>
            </View>
          </View>

          {/* Số điện thoại with "Thay đổi" button */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Số điện thoại <Text style={styles.reqStar}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Icon name="call" size={20} color={ArtisanColors.onSurfaceVariant} />
              <TextInput
                style={[styles.inputField, { paddingRight: 8 }]}
                value={phone}
                editable={false}
              />
              <Pressable
                onPress={handleChangePhone}
                style={({ pressed }) => [styles.changePhoneBtn, pressed && styles.pressed]}>
                <Text style={styles.changePhoneBtnText}>Thay đổi</Text>
              </Pressable>
            </View>
          </View>

          {/* Ngày sinh with Birthday voucher perk */}
          <View style={styles.formGroup}>
            <View style={styles.labelWithPerkRow}>
              <Text style={styles.label}>Ngày sinh</Text>
              <View style={styles.perkRow}>
                <Icon
                  name="featured_seasonal_and_gifts"
                  size={14}
                  color={ArtisanColors.primary}
                />
                <Text style={styles.perkText}>Tặng voucher tiệc sinh nhật</Text>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="cake" size={20} color={ArtisanColors.onSurfaceVariant} />
              <TextInput
                style={styles.inputField}
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={ArtisanColors.outline}
              />
              <Icon name="calendar_today" size={18} color={ArtisanColors.onSurfaceVariant} />
            </View>
          </View>

          {/* Giới tính: Tactile Pills */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderGrid}>
              {[
                { key: 'male', label: 'Nam', icon: 'male' },
                { key: 'female', label: 'Nữ', icon: 'female' },
                { key: 'other', label: 'Khác', icon: 'transgender' },
              ].map((item) => {
                const isSelected = gender === item.key;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setGender(item.key as any)}
                    style={[
                      styles.genderPill,
                      isSelected ? styles.genderPillActive : styles.genderPillInactive,
                    ]}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={isSelected ? '#ffffff' : ArtisanColors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.genderPillText,
                        isSelected ? styles.genderPillTextActive : styles.genderPillTextInactive,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Địa chỉ giao hàng mặc định */}
          <View style={styles.formGroup}>
            <View style={styles.labelWithActionRow}>
              <Text style={styles.label}>Địa chỉ nhận món giao tận nơi</Text>
              <Pressable
                onPress={handleUseCurrentLocation}
                style={({ pressed }) => [styles.locationActionBtn, pressed && styles.pressed]}>
                <Icon name="my_location" size={14} color={ArtisanColors.primary} />
                <Text style={styles.locationActionText}>Vị trí hiện tại</Text>
              </Pressable>
            </View>
            <View style={styles.textareaWrapper}>
              <View style={styles.textareaIcon}>
                <Icon name="location_on" size={20} color={ArtisanColors.primary} fill />
              </View>
              <TextInput
                style={styles.textarea}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                placeholder="Nhập địa chỉ nhận hàng"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>

            {/* Checkbox: Đặt làm mặc định */}
            <Pressable
              onPress={() => setIsDefaultAddress(!isDefaultAddress)}
              style={styles.defaultAddressRow}>
              <View
                style={[
                  styles.checkboxBox,
                  isDefaultAddress && styles.checkboxBoxChecked,
                ]}>
                {isDefaultAddress && <Icon name="check" size={12} color="#ffffff" />}
              </View>
              <Text style={styles.defaultAddressText}>
                Đặt làm địa chỉ giao hàng mặc định cho bữa trưa & tối
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 4. Privacy & Security Note */}
        <View style={styles.securityBox}>
          <View style={styles.securityIconBox}>
            <Icon name="security" size={18} color={ArtisanColors.onSurfaceVariant} />
          </View>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Bảo mật thông tin khách ẩm thực</Text>
            <Text style={styles.securityDesc}>
              Thông tin của bạn được mã hóa và bảo mật theo tiêu chuẩn ẩm thực Artisan Kitchen. Chúng tôi cam kết không chia sẻ cho bên thứ ba.
            </Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* 5. Bottom Fixed Actions */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}>
        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            isLoading && { opacity: 0.7 },
            pressed && styles.pressed,
          ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Icon name="check" size={20} color="#ffffff" />
              <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
            </>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.discardBtn, pressed && styles.pressed]}>
          <Text style={styles.discardBtnText}>Hủy bỏ và quay lại</Text>
        </Pressable>
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
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    color: ArtisanColors.onSurfaceVariant,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: ArtisanColors.surfaceContainer,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadgeBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changeAvatarTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  changeAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  avatarHelperText: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    marginTop: 4,
  },
  formSection: {
    gap: 18,
  },
  formGroup: {
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lastNameCol: {
    flex: 3,
    gap: 6,
  },
  firstNameCol: {
    flex: 2,
    gap: 6,
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
    gap: 8,
  },
  readOnlyInputWrapper: {
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderColor: 'rgba(216, 194, 188, 0.4)',
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: ArtisanColors.onSurface,
    paddingVertical: 8,
  },
  readOnlyInputField: {
    color: ArtisanColors.onSurfaceVariant,
  },
  usernamePrefix: {
    fontSize: 15,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fixedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ArtisanColors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  fixedBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: ArtisanColors.onSurfaceVariant,
  },
  fieldHelperText: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 16,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 106, 33, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ArtisanColors.tertiary,
  },
  changePhoneBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changePhoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  labelWithPerkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  perkText: {
    fontSize: 12,
    fontWeight: '500',
    color: ArtisanColors.primary,
  },
  genderGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  genderPill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  genderPillActive: {
    backgroundColor: '#2A201C',
    borderColor: '#2A201C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  genderPillInactive: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderColor: ArtisanColors.outlineVariant,
  },
  genderPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  genderPillTextActive: {
    color: '#ffffff',
  },
  genderPillTextInactive: {
    color: ArtisanColors.onSurface,
  },
  labelWithActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  textareaWrapper: {
    minHeight: 70,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ArtisanColors.outlineVariant,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  textareaIcon: {
    marginTop: 2,
  },
  textarea: {
    flex: 1,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    lineHeight: 20,
    paddingTop: 0,
  },
  defaultAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: ArtisanColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: ArtisanColors.primary,
    borderColor: ArtisanColors.primary,
  },
  defaultAddressText: {
    fontSize: 13,
    color: ArtisanColors.onSurface,
    flex: 1,
  },
  securityBox: {
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(216, 194, 188, 0.4)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  securityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ArtisanColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 16,
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
  saveBtn: {
    height: 50,
    borderRadius: 25,
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
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  discardBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  discardBtnText: {
    fontSize: 14,
    color: ArtisanColors.onSurfaceVariant,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

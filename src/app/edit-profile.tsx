import { Image } from 'expo-image';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { MOCK_USER } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const [lastName, setLastName] = useState('Nguyễn Hoàng');
  const [firstName, setFirstName] = useState('Minh');
  const [dob, setDob] = useState('1995-10-24');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [address, setAddress] = useState(MOCK_USER.addresses[0]?.detail || '');
  const [dietaryNotes, setDietaryNotes] = useState('Ít ngọt, không hành tây sống');

  const handleSave = () => {
    router.replace('/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="arrow_back" size={20} color={ArtisanColors.onSurface} />
        </Pressable>

        <View style={styles.brandBadge}>
          <Icon name="restaurant" size={18} color={ArtisanColors.primary} fill />
          <Text style={styles.brandBadgeText}>Artisan Kitchen</Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.skipBtn}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Stepper & Headline */}
        <View style={styles.heroSection}>
          <View style={styles.stepBadge}>
            <Icon name="verified" size={14} color={ArtisanColors.primary} fill />
            <Text style={styles.stepBadgeText}>BƯỚC CUỐI CÙNG</Text>
          </View>
          <Text style={styles.pageTitle}>Thông tin cá nhân</Text>
          <Text style={styles.pageDesc}>
            Cung cấp thêm thông tin để nhận quà tặng sinh nhật độc quyền và trải nghiệm ẩm thực được cá nhân hoá chu đáo hơn.
          </Text>
        </View>

        {/* Avatar Upload */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: MOCK_USER.avatar }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
            <Pressable style={styles.cameraIconBtn}>
              <Icon name="photo_camera" size={16} color="#ffffff" />
            </Pressable>
          </View>
          <Pressable style={styles.changeAvatarBtn}>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.nameGrid}>
            <View style={styles.nameColLeft}>
              <Text style={styles.label}>
                Họ & tên đệm <Text style={styles.reqStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nguyễn Hoàng"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>

            <View style={styles.nameColRight}>
              <Text style={styles.label}>
                Tên <Text style={styles.reqStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Minh"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Ngày sinh <Text style={styles.labelSub}>(nhận ưu đãi sinh nhật)</Text>
            </Text>
            <View style={styles.inputWithIcon}>
              <Icon name="calendar_today" size={18} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.inputInner}
                value={dob}
                onChangeText={setDob}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
          </View>

          {/* Gender Selector Chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderRow}>
              {[
                { key: 'male', label: 'Nam', icon: 'male' },
                { key: 'female', label: 'Nữ', icon: 'female' },
                { key: 'other', label: 'Khác', icon: 'person' },
              ].map((g) => {
                const isSelected = gender === g.key;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => setGender(g.key as any)}
                    style={[styles.genderChip, isSelected && styles.genderChipSelected]}>
                    <Icon
                      name={g.icon}
                      size={18}
                      color={isSelected ? ArtisanColors.primary : ArtisanColors.secondary}
                    />
                    <Text
                      style={[
                        styles.genderText,
                        isSelected && styles.genderTextSelected,
                      ]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Số điện thoại liên hệ</Text>
            <View style={styles.inputWithIcon}>
              <Icon name="call" size={18} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.inputInner}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+84 908..."
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
          </View>

          {/* Default Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Địa chỉ nhận hàng mặc định</Text>
            <View style={styles.inputWithIcon}>
              <Icon name="location_on" size={18} color={ArtisanColors.secondary} />
              <TextInput
                style={styles.inputInner}
                value={address}
                onChangeText={setAddress}
                placeholder="Số nhà, tên đường, quận..."
                placeholderTextColor={ArtisanColors.outline}
              />
            </View>
          </View>

          {/* Dietary Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ghi chú khẩu vị & Dị ứng</Text>
            <TextInput
              style={styles.textArea}
              value={dietaryNotes}
              onChangeText={setDietaryNotes}
              placeholder="Ví dụ: Dị ứng tôm cua, ít cay, không hành tây sống..."
              placeholderTextColor={ArtisanColors.outline}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Docked Save Button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
          <Text style={styles.saveBtnText}>Lưu thông tin</Text>
          <Icon name="arrow_forward" size={18} color="#ffffff" />
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
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(227, 190, 181, 0.3)',
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
    borderColor: 'rgba(143, 112, 104, 0.15)',
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroSection: {
    gap: 6,
    marginBottom: 20,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(173, 44, 0, 0.1)',
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ArtisanColors.primary,
    letterSpacing: 0.6,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.4,
  },
  pageDesc: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    lineHeight: 18,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: ArtisanColors.outlineVariant,
    borderStyle: 'dashed',
    padding: 3,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  cameraIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ArtisanColors.surface,
  },
  changeAvatarBtn: {
    paddingVertical: 2,
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  form: {
    gap: 16,
  },
  nameGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  nameColLeft: {
    flex: 3,
    gap: 6,
  },
  nameColRight: {
    flex: 2,
    gap: 6,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  reqStar: {
    color: ArtisanColors.primary,
  },
  labelSub: {
    fontWeight: '400',
    color: ArtisanColors.secondary,
    fontSize: 12,
  },
  input: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    paddingHorizontal: 12,
    fontSize: 14,
    color: ArtisanColors.onSurface,
  },
  inputWithIcon: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputInner: {
    flex: 1,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    padding: 0,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  genderChipSelected: {
    borderColor: ArtisanColors.primary,
    backgroundColor: 'rgba(173, 44, 0, 0.06)',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.secondary,
  },
  genderTextSelected: {
    color: ArtisanColors.primary,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 80,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    padding: 12,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ArtisanColors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(143, 112, 104, 0.2)',
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 40,
    ...Platform.select({
      web: {
        maxWidth: 520,
        marginHorizontal: 'auto' as any,
      },
    }),
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

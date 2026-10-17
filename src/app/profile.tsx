import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/bottom-navigation';
import { Icon } from '@/components/icon';
import { TopHeader } from '@/components/top-header';
import { ArtisanColors } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import { useUserProfile } from '@/features/user';

export default function ProfileScreen() {
  const { user, profile, isLoading } = useUserProfile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const doLogout = async () => {
      try {
        await logout();
        router.replace('/login');
      } catch {
        router.replace('/login');
      }
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?');
      if (confirmLogout) {
        await doLogout();
      }
    } else {
      Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TopHeader
          title="Hồ sơ cá nhân"
          showBranch={false}
          showNotifications={false}
        />
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={ArtisanColors.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin tài khoản...</Text>
        </View>
        <BottomNavigation currentTab="profile" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TopHeader
          title="Hồ sơ cá nhân"
          showBranch={false}
          showNotifications={false}
        />
        <View style={styles.guestContainer}>
          <View style={styles.guestIconBox}>
            <Icon name="person" size={48} color={ArtisanColors.outlineVariant} />
          </View>
          <Text style={styles.guestTitle}>Chưa đăng nhập</Text>
          <Text style={styles.guestSubtitle}>
            Đăng nhập để xem thông tin tài khoản cá nhân, lịch sử đơn hàng và nhận các ưu đãi hấp dẫn.
          </Text>
          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [styles.loginCtaBtn, pressed && styles.pressed]}>
            <Text style={styles.loginCtaText}>Đăng nhập ngay</Text>
          </Pressable>
        </View>
        <BottomNavigation currentTab="profile" />
      </SafeAreaView>
    );
  }

  const displayName = profile
    ? `${profile.lastName} ${profile.firstName}`.trim()
    : user.userName;
  const displayEmail = user.email;
  const roleTitle = user.roleName ? `Hội viên (${user.roleName})` : 'Hội viên Artisan';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <TopHeader
        title="Hồ sơ cá nhân"
        showBranch={false}
        showNotifications={false}
        rightAction={
          <Pressable
            accessibilityLabel="Cài đặt"
            onPress={() => router.push('/edit-profile')}
            style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}>
            <Icon name="tune" size={20} color={ArtisanColors.onSurfaceVariant} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Header & Avatar */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitialText}>
                  {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Đổi thông tin cá nhân"
              onPress={() => router.push('/edit-profile')}
              style={styles.cameraBtn}>
              <Icon name="edit" size={14} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {displayName}
              </Text>
              <Icon name="verified" size={18} color={ArtisanColors.tertiary} fill />
            </View>
            <Text style={styles.userHandle}>@{user.userName}</Text>
            <View style={styles.tierChip}>
              <Icon name="stars" size={14} color={ArtisanColors.primary} fill />
              <Text style={styles.tierText}>{roleTitle}</Text>
            </View>
          </View>
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Icon name="card_membership" size={20} color={ArtisanColors.primaryFixed} />
              <Text style={styles.cardHeaderTitle}>THẺ HỘI VIÊN ARTISAN</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValGold}>{user.roleName || 'Member'}</Text>
              <Text style={styles.statSub}>Cấp bậc</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValWhite}>Đã kích hoạt</Text>
              <Text style={styles.statSub}>Trạng thái</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValGreen}>Bảo chứng</Text>
              <Text style={styles.statSub}>Chính sách</Text>
            </View>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="badge" size={20} color={ArtisanColors.primary} />
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            </View>
            <Pressable
              onPress={() => router.push('/edit-profile')}
              style={styles.editBtn}>
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
              <Icon name="edit" size={15} color={ArtisanColors.primary} />
            </Pressable>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ và tên</Text>
            <Text style={styles.infoValueBold}>{displayName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.infoValue}>{displayEmail}</Text>
              <View style={styles.verifiedBadge}>
                <Icon name="check_circle" size={11} color={ArtisanColors.tertiary} fill />
                <Text style={styles.verifiedText}>Đã xác nhận</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>{profile?.phone || 'Chưa cập nhật'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày sinh</Text>
            <Text style={styles.infoValue}>{profile?.dateOfBirth || 'Chưa cập nhật'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giới tính</Text>
            <Text style={styles.infoValue}>
              {profile ? (profile.gender ? 'Nam' : 'Nữ') : 'Chưa cập nhật'}
            </Text>
          </View>
        </View>

        {/* Saved Addresses */}
        <View style={styles.infoSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="location_on" size={20} color={ArtisanColors.primary} />
              <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            </View>
            <Pressable onPress={() => router.push('/edit-profile')} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Cập nhật</Text>
              <Icon name="edit" size={15} color={ArtisanColors.primary} />
            </Pressable>
          </View>

          {profile?.address ? (
            <View style={styles.addrCard}>
              <View style={styles.addrTopRow}>
                <Text style={styles.addrLabel}>Địa chỉ của tôi</Text>
                <View style={styles.defaultAddrBadge}>
                  <Text style={styles.defaultAddrText}>Mặc định</Text>
                </View>
              </View>
              <Text style={styles.addrDetail}>
                {profile.address}{profile.city ? `, ${profile.city}` : ''}
              </Text>
            </View>
          ) : (
            <View style={{ paddingVertical: 12 }}>
              <Text style={{ fontSize: 13, color: ArtisanColors.secondary }}>
                Chưa cập nhật địa chỉ. Nhấn "Cập nhật" để bổ sung địa chỉ nhận hàng.
              </Text>
            </View>
          )}
        </View>

        {/* Settings & Utilities */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Cài đặt & Tiện ích</Text>

          {[
            {
              title: 'Lịch sử đơn hàng',
              icon: 'receipt_long',
              action: () => router.push('/orders'),
            },
            {
              title: 'Phương thức thanh toán',
              icon: 'credit_card',
              action: () => {},
            },
            {
              title: 'Món ăn yêu thích',
              icon: 'favorite',
              action: () => router.push('/saved'),
            },
            {
              title: 'Thông báo & Khuyến mãi',
              icon: 'notifications',
              action: () => {},
            },
            {
              title: 'Đổi mật khẩu',
              icon: 'lock',
              action: () => router.push('/change-password'),
            },
            {
              title: 'Ngôn ngữ: Tiếng Việt',
              icon: 'translate',
              action: () => {},
            },
          ].map((item) => (
            <Pressable
              key={item.title}
              onPress={item.action}
              style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
              <View style={styles.settingRowLeft}>
                <Icon name={item.icon} size={20} color={ArtisanColors.secondary} />
                <Text style={styles.settingRowTitle}>{item.title}</Text>
              </View>
              <Icon name="chevron_right" size={18} color={ArtisanColors.outline} />
            </Pressable>
          ))}

          {/* Logout Button */}
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
            <Icon name="logout" size={20} color={ArtisanColors.error} />
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </Pressable>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Docked Full-Width Bottom Navigation */}
      <BottomNavigation currentTab="profile" />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeaderCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: ArtisanColors.primaryFixed,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  userHandle: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    marginBottom: 4,
  },
  tierChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: ArtisanColors.secondaryContainer,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.onSecondaryContainer,
  },
  membershipCard: {
    backgroundColor: ArtisanColors.darkRoast,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: ArtisanColors.primaryFixed,
    letterSpacing: 0.8,
  },
  rewardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  rewardBtnText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  statValGold: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.primaryFixed,
  },
  statValWhite: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  statValGreen: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.tertiaryFixed,
  },
  statSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ArtisanColors.surfaceContainerLow,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 13,
    color: ArtisanColors.onSurfaceVariant,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: ArtisanColors.onSurface,
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 105, 71, 0.1)',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  birthdayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: ArtisanColors.secondaryContainer,
  },
  birthdayText: {
    fontSize: 10,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  addrCard: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    gap: 4,
  },
  addrTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addrLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  defaultAddrBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: ArtisanColors.primaryFixed,
  },
  defaultAddrText: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.onPrimaryFixed,
  },
  addrDetail: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    lineHeight: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ArtisanColors.surfaceContainerLow,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowTitle: {
    fontSize: 14,
    color: ArtisanColors.onSurface,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.error,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: ArtisanColors.secondary,
    fontWeight: '600',
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  guestIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  guestSubtitle: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  loginCtaBtn: {
    marginTop: 12,
    backgroundColor: ArtisanColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  loginCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
});

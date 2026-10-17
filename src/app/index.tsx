import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingCartBar } from '@/components/floating-cart-bar';
import { Icon } from '@/components/icon';
import { TopHeader } from '@/components/top-header';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { useCart } from '@/features/cart';
import { useHome } from '@/features/home';
import { useUserProfile } from '@/features/user';

export default function HomeScreen() {
  const { activeBranch, branches, selectBranch } = useBranches();
  const { products, categories: backendCategories, isRefreshing, onRefresh, isLoading } = useHome(activeBranch?.id);
  const { totalItemsCount, subtotal, addItem: addToCart } = useCart(activeBranch?.id);
  const { user } = useUserProfile();

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Danh mục từ backend
  const categoryList = backendCategories.length > 0
    ? ['Tất cả', ...backendCategories.map((c) => c.name)]
    : ['Tất cả'];

  // Dữ liệu món ăn từ backend
  const availableDishes = products.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.brandName || p.categoryName || 'Món ngon thủ công',
    price: p.unitPrice || 0,
    priceFormatted: (p.unitPrice || 0).toLocaleString('vi-VN') + ' đ',
    calories: '450 kcal',
    category: p.categoryName || 'Món chính',
    badge: p.stockStatus === 1 ? 'Món Bếp trưởng' : undefined,
    rating: '4.9',
    image:
      p.primaryImage?.image?.url ||
      'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    description: p.description || '',
  }));

  const filteredDishes = availableDishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'Tất cả' ||
      dish.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Món Bếp trưởng' && (dish.badge?.includes('Bếp trưởng') || dish.badge?.includes('Tráng miệng')));
    const matchesQuery =
      searchQuery.trim() === '' ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleAddToCart = async (dishId: string, dishName: string) => {
    try {
      await addToCart(dishId);
      Alert.alert('Thành công', `Đã thêm ${dishName} vào giỏ hàng`);
    } catch (err) {
      Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleSwitchBranch = () => {
    if (branches.length === 0) {
      Alert.alert('Chi nhánh', 'Hiện chỉ có 1 chi nhánh khả dụng.');
      return;
    }
    Alert.alert(
      'Chọn chi nhánh',
      'Vui lòng chọn chi nhánh gần bạn nhất:',
      [
        ...branches.map((b) => ({
          text: b.name + (b.id === activeBranch?.id ? ' (Đang chọn)' : ''),
          onPress: () => selectBranch(b),
        })),
        { text: 'Hủy', style: 'cancel' as const },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top App Bar */}
      <TopHeader
        title={activeBranch?.name || 'Artisan Kitchen'}
        showBranch
        showNotifications
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={ArtisanColors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}>
        {/* Customer Greeting & Avatar */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greetingSub}>BẢO CHỨNG ẨM THỰC</Text>
            <Text style={styles.greetingTitle}>
              {user?.userName ? `Chào ${user.userName}` : 'Chào buổi tối'} <Text style={styles.waveEmoji}>👋</Text>
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Hồ sơ cá nhân"
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.avatarRing, pressed && styles.pressed]}>
            <View style={styles.avatarInner}>
              {user?.userName ? (
                <Text style={styles.avatarInitial}>{user.userName.charAt(0).toUpperCase()}</Text>
              ) : (
                <Icon name="person" size={24} color="#ffffff" />
              )}
            </View>
          </Pressable>
        </View>

        {/* Branch Selector Micro-Card */}
        <View style={styles.branchCard}>
          <View style={styles.branchCardLeft}>
            <View style={styles.locationIconBox}>
              <Icon name="location_on" size={20} color={ArtisanColors.primary} fill />
            </View>
            <View style={styles.branchInfo}>
              <Text style={styles.branchCardTitle}>
                {activeBranch?.name || 'Đang kết nối chi nhánh...'}
              </Text>
              <View style={styles.branchCardMeta}>
                <Text style={styles.metaDistance}>
                  {activeBranch?.address ? `${activeBranch.address}${activeBranch.city ? `, ${activeBranch.city}` : ''}` : 'Nhà hàng thủ công'}
                </Text>
                {activeBranch?.phone ? (
                  <>
                    <View style={styles.metaDot} />
                    <Text style={styles.metaStatus}>{activeBranch.phone}</Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.switchButton, pressed && styles.pressed]}
            onPress={handleSwitchBranch}>
            <Text style={styles.switchButtonText}>Đổi chi nhánh</Text>
          </Pressable>
        </View>

        {/* Search & Voice/Filter Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={ArtisanColors.outline} />
          <TextInput
            placeholder="Tìm pizza nướng củi, burger, mì Ý thủ công..."
            placeholderTextColor={ArtisanColors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <View style={styles.searchDivider} />
          <Pressable style={styles.searchIconBtn}>
            <Icon name="mic" size={19} color={ArtisanColors.secondary} />
          </Pressable>
          <Pressable
            style={styles.searchIconBtn}
            onPress={() => router.push('/menu')}>
            <Icon name="tune" size={19} color={ArtisanColors.secondary} />
          </Pressable>
        </View>

        {/* Promotional Hero Feature: Summer Truffle Festival */}
        <View style={styles.heroPromo}>
          <Image
            source={{
              uri:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCzfEUD125HvRZXlwnQa1sBWcalJdsr2hROnvEwEE5GVGx-q4h1-zLFRTI0KwkGtQGIF-SR4JYckwkN8_YOaX0crKcjSmOCLA1VvE3aCu1nw4F0pGPb3OQXpitbr-yqj9pl21GnLJMFU-FOnsV81pfkruLNo8Rp9jaS9opagXvb1NH9ZS-9FsxBqlAG3pZJk0xcmgQezZ_mLQJhKg2Tj4NH6MvWHrAx0kV7PNsy2tUbn9MEK_-MUwad8w',
            }}
            style={styles.heroPromoBg}
            contentFit="cover"
          />
          <View style={styles.heroGradientOverlay} />

          <View style={styles.heroPromoContent}>
            <View style={styles.promoChip}>
              <Icon name="local_fire_department" size={13} color={ArtisanColors.primary} fill />
              <Text style={styles.promoChipText}>MÓN ĐẶC BIỆT CỦA BẾP TRƯỞNG</Text>
            </View>

            <Text style={styles.promoTitle}>Lễ hội Nấm Truffle{'\n'}Mùa Hè</Text>
            <Text style={styles.promoDesc}>
              Giảm 25% các món ẩm thực tuyển chọn kết hợp nấm truffle đen Ý.
            </Text>

            <View style={styles.promoActions}>
              <View style={styles.couponBadge}>
                <Text style={styles.couponText}>TRUFFLE25</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}
                onPress={() => router.push('/menu')}>
                <Text style={styles.exploreBtnText}>Xem thực đơn</Text>
                <Icon name="arrow_forward" size={16} color={ArtisanColors.onPrimaryContainer} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Category Filter Pills Track */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={({ pressed }) => [
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                    pressed && styles.pressed,
                  ]}>
                  {cat.includes('Pizza') && (
                    <Icon
                      name="local_pizza"
                      size={16}
                      color={isSelected ? ArtisanColors.primaryFixed : ArtisanColors.secondary}
                      fill
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.categoryPillTextActive,
                    ]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Creations Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Món Ngon Tinh Hoa Nổi Bật</Text>
            <Text style={styles.sectionSubtitle}>Chế biến tươi mới mỗi ngày bởi đội ngũ bếp trưởng</Text>
          </View>
          <Pressable onPress={() => router.push('/menu')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </Pressable>
        </View>

        {/* 2-Column Product Grid */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ArtisanColors.primary} />
            <Text style={styles.loadingText}>Đang tải món ăn từ máy chủ...</Text>
          </View>
        ) : filteredDishes.length > 0 ? (
          <View style={styles.dishGrid}>
            {filteredDishes.map((dish) => (
              <Pressable
                key={dish.id}
                accessibilityRole="button"
                accessibilityLabel={dish.name}
                onPress={() => router.push({ pathname: '/food-detail', params: { id: dish.id } })}
                style={({ pressed }) => [styles.dishCard, pressed && styles.pressed]}>
                <View style={styles.dishImageWrap}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                    contentFit="cover"
                    transition={200}
                  />
                  {dish.badge && (
                    <View style={styles.dishBadge}>
                      <Text style={styles.dishBadgeText}>{dish.badge}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.dishDetails}>
                  <Text style={styles.dishName} numberOfLines={1}>
                    {dish.name}
                  </Text>
                  <Text style={styles.dishSub} numberOfLines={1}>
                    {dish.subtitle}
                  </Text>

                  <View style={styles.dishBottomRow}>
                    <Text style={styles.dishPrice}>{dish.priceFormatted}</Text>
                    <Pressable
                      accessibilityLabel={`Thêm ${dish.name} vào giỏ`}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(dish.id, dish.name);
                      }}
                      style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
                      <Icon name="add" size={18} color={ArtisanColors.onSurface} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Icon name="restaurant_menu" size={40} color={ArtisanColors.outlineVariant} />
            <Text style={styles.emptyTitle}>Chưa có món ăn nào</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'Không tìm thấy món ăn phù hợp với từ khóa.'
                : 'Thực đơn của chi nhánh đang được cập nhật từ máy chủ.'}
            </Text>
          </View>
        )}

        {/* Culinary Narrative Callout */}
        <View style={styles.narrativeCard}>
          <View style={styles.narrativeIconBox}>
            <Icon name="verified" size={22} color={ArtisanColors.onPrimaryFixed} fill />
          </View>
          <View style={styles.narrativeInfo}>
            <Text style={styles.narrativeTitle}>100% Từ Nông Trại Đến Bếp Đá</Text>
            <Text style={styles.narrativeDesc}>
              Nông sản hữu cơ được chọn lọc kỹ lưỡng từ các nhà vườn vùng cao Đà Lạt và đối tác bền vững.
            </Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Persistent Cart Drawer */}
      <FloatingCartBar
        itemCount={totalItemsCount}
        subtotal={subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')} đ` : '0 đ'}
        bottomOffset={70}
      />

      {/* Docked Full-Width Bottom Navigation */}
      <BottomNavigation currentTab="home" />
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
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  greetingLeft: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 1.2,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  waveEmoji: {
    fontSize: 20,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 2,
    backgroundColor: ArtisanColors.primary,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  branchCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0EAE3',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  branchCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  locationIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchInfo: {
    flex: 1,
  },
  branchCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  branchCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaDistance: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ArtisanColors.outline,
  },
  metaStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.tertiary,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(173, 44, 0, 0.08)',
  },
  switchButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  searchBar: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EFE9E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 14,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    padding: 0,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#EFE9E2',
    marginHorizontal: 6,
  },
  searchIconBtn: {
    padding: 6,
  },
  heroPromo: {
    height: 185,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 16,
    position: 'relative',
    backgroundColor: ArtisanColors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: '#EFE9E2',
  },
  heroPromoBg: {
    ...StyleSheet.absoluteFill,
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(251, 249, 246, 0.88)',
    width: '78%',
  },
  heroPromoContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    width: '78%',
    zIndex: 10,
  },
  promoChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  promoChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: ArtisanColors.primary,
    letterSpacing: 0.4,
  },
  promoTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    lineHeight: 23,
    letterSpacing: -0.4,
  },
  promoDesc: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 16,
  },
  promoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: ArtisanColors.primary,
    borderStyle: 'dashed',
  },
  couponText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.primary,
    letterSpacing: 0.5,
  },
  exploreBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: ArtisanColors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.onPrimaryContainer,
  },
  categorySection: {
    marginTop: 16,
    marginHorizontal: -16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: '#EFE9E2',
  },
  categoryPillActive: {
    backgroundColor: ArtisanColors.darkRoast,
    borderColor: ArtisanColors.darkRoast,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  dishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dishCard: {
    width: '48%',
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    justifyContent: 'space-between',
  },
  dishImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: ArtisanColors.surfaceContainer,
    position: 'relative',
    marginBottom: 8,
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  dishBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  dishBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  dishDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.2,
  },
  dishSub: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    marginTop: 2,
    lineHeight: 15,
  },
  dishBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 4,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  narrativeCard: {
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EFE9E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  narrativeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ArtisanColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  narrativeInfo: {
    flex: 1,
  },
  narrativeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  narrativeDesc: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
    lineHeight: 16,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: ArtisanColors.secondary,
    fontWeight: '600',
  },
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    marginVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(143, 112, 104, 0.15)',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

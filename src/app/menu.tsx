import { Image } from 'expo-image';
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

import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingCartBar } from '@/components/floating-cart-bar';
import { Icon } from '@/components/icon';
import { TopHeader } from '@/components/top-header';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { useCart } from '@/features/cart';
import { useCategories, useProducts } from '@/features/catalog';
import { useWishlist } from '@/features/wishlist';

export default function MenuScreen() {
  const { activeBranch } = useBranches();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const { products, isLoading: isProductsLoading } = useProducts({ branchId: activeBranch?.id, keyword: searchQuery });
  const { categories: backendCategories, isLoading: isCategoriesLoading } = useCategories();
  const { isFavorite, toggleFavorite } = useWishlist(activeBranch?.id);
  const { totalItemsCount, subtotal, addItem: addToCart } = useCart(activeBranch?.id);

  const isLoading = isProductsLoading || isCategoriesLoading;

  const categoryList = backendCategories.length > 0
    ? ['Tất cả', ...backendCategories.map((c) => c.name)]
    : ['Tất cả'];

  const availableDishes = products.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.brandName || p.categoryName || 'Món ngon thủ công',
    price: p.unitPrice || 0,
    priceFormatted: (p.unitPrice || 0).toLocaleString('vi-VN') + ' đ',
    calories: '450 kcal',
    category: p.categoryName || 'Tất cả',
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <TopHeader
        title={activeBranch?.name || 'Artisan Kitchen'}
        showBranch
        showNotifications
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Title & Cart Row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.subTitle}>BẾP ĂN THỦ CÔNG</Text>
            <Text style={styles.screenTitle}>Thực đơn & Danh mục</Text>
          </View>
          <Pressable
            accessibilityLabel="Giỏ hàng"
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [styles.cartBtn, pressed && styles.pressed]}>
            <Icon name="shopping_bag" size={22} color={ArtisanColors.onSurface} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItemsCount}</Text>
            </View>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={ArtisanColors.secondary} />
          <TextInput
            placeholder="Tìm nấm truffle, pizza, mì Ý, đồ uống..."
            placeholderTextColor={ArtisanColors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.searchAction}>
              <Icon name="close" size={18} color={ArtisanColors.secondary} />
            </Pressable>
          )}
          <View style={styles.searchDivider} />
          <Pressable style={styles.searchAction}>
            <Icon name="mic" size={20} color={ArtisanColors.primary} />
          </Pressable>
        </View>

        {/* Horizontal Category Pills */}
        <View style={styles.categoryWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}>
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={({ pressed }) => [
                    styles.pill,
                    isSelected && styles.pillActive,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Sort & Filter Bar */}
        <View style={styles.filterBar}>
          <View style={styles.filterLeft}>
            <Pressable style={styles.filterBtn}>
              <Icon name="tune" size={16} color={ArtisanColors.primary} />
              <Text style={styles.filterBtnText}>Bộ lọc (1)</Text>
            </Pressable>
            <Pressable style={styles.sortBtn}>
              <Text style={styles.sortLabel}>Sắp xếp: </Text>
              <Text style={styles.sortVal}>Gợi ý</Text>
              <Icon name="expand_more" size={16} color={ArtisanColors.onSurface} />
            </Pressable>
          </View>
          <View style={styles.branchBadge}>
            <View style={styles.branchDot} />
            <Text style={styles.branchBadgeText} numberOfLines={1}>
              {activeBranch?.name || 'Artisan Kitchen'}
            </Text>
          </View>
        </View>

        {/* 2-Column Product Grid */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ArtisanColors.primary} />
            <Text style={styles.loadingText}>Đang tải thực đơn từ máy chủ...</Text>
          </View>
        ) : filteredDishes.length > 0 ? (
          <View style={styles.grid}>
            {filteredDishes.map((dish) => {
              const isFav = isFavorite(dish.id);
              return (
                <Pressable
                  key={dish.id}
                  onPress={() => router.push({ pathname: '/food-detail', params: { id: dish.id } })}
                  style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
                  <View style={styles.imageWrap}>
                    <Image
                      source={{ uri: dish.image }}
                      style={styles.dishImage}
                      contentFit="cover"
                      transition={200}
                    />

                    {/* Wishlist Heart */}
                    <Pressable
                      accessibilityLabel="Lưu yêu thích"
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dish.id);
                      }}
                      style={styles.heartBtn}>
                      <Icon
                        name="favorite"
                        size={17}
                        color={isFav ? ArtisanColors.primary : ArtisanColors.secondary}
                        fill={isFav}
                      />
                    </Pressable>

                    {/* Calories Badge */}
                    <View style={styles.calBadge}>
                      <Icon name="local_fire_department" size={12} color={ArtisanColors.tertiary} fill />
                      <Text style={styles.calText}>{dish.calories}</Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.dishName} numberOfLines={1}>
                      {dish.name}
                    </Text>
                    <Text style={styles.dishSub} numberOfLines={1}>
                      {dish.subtitle}
                    </Text>

                    <View style={styles.bottomRow}>
                      <Text style={styles.price}>{dish.priceFormatted}</Text>
                      <Pressable
                        accessibilityLabel={`Thêm ${dish.name} vào giỏ hàng`}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAddToCart(dish.id, dish.name);
                        }}
                        style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
                        <Icon name="add" size={18} color="#ffffff" />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Icon name="restaurant_menu" size={44} color={ArtisanColors.outlineVariant} />
            <Text style={styles.emptyTitle}>Không có món ăn phù hợp</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? `Không tìm thấy món ăn nào với từ khóa "${searchQuery}".`
                : 'Hiện tại chưa có món ăn nào trong danh mục này.'}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Persistent Cart Drawer */}
      <FloatingCartBar
        itemCount={totalItemsCount}
        subtotal={subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')} đ` : '0 đ'}
        bottomOffset={70}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentTab="menu" />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.outline,
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(143, 112, 104, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  searchBar: {
    height: 48,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 12,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    padding: 0,
  },
  searchAction: {
    padding: 4,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(227, 190, 181, 0.5)',
    marginHorizontal: 6,
  },
  categoryWrap: {
    marginTop: 14,
    marginHorizontal: -16,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
  },
  pillActive: {
    backgroundColor: ArtisanColors.darkRoast,
    borderColor: ArtisanColors.darkRoast,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  pillTextActive: {
    color: '#ffffff',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(143, 112, 104, 0.2)',
    marginTop: 14,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: ArtisanColors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
  },
  sortLabel: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  sortVal: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: ArtisanColors.secondaryContainer,
    maxWidth: 150,
  },
  branchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.primary,
  },
  branchBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ArtisanColors.onSecondaryFixed,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  card: {
    width: '48%',
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    overflow: 'hidden',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: ArtisanColors.surfaceContainer,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  calText: {
    fontSize: 10,
    fontWeight: '600',
    color: ArtisanColors.secondary,
  },
  cardContent: {
    padding: 10,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    lineHeight: 18,
  },
  dishSub: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    marginTop: 2,
    lineHeight: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  loadingWrap: {
    paddingVertical: 56,
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
    paddingVertical: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    marginVertical: 16,
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

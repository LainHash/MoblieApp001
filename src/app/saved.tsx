import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/bottom-navigation';
import { Icon } from '@/components/icon';
import { CURRENT_BRANCH, DISHES } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'entrees', name: 'Món chính' },
  { id: 'pizza', name: 'Pizza lò củi' },
  { id: 'desserts', name: 'Tráng miệng' },
  { id: 'beverages', name: 'Đồ uống' },
];

export default function SavedScreen() {
  const { activeBranch } = useBranches();
  const { items: wishlistItems, toggleFavorite, moveAllToCart } = useWishlist(activeBranch?.id);
  const { addItem: addToCart } = useCart(activeBranch?.id);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chefSpecialsOnly, setChefSpecialsOnly] = useState(false);

  // Ánh xạ dữ liệu từ backend wishlist hoặc fallback DISHES
  const savedDishes = wishlistItems.length > 0
    ? wishlistItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        subtitle: item.product.categoryName || item.product.brandName || 'Món ngon thủ công',
        description: item.product.description || 'Chế biến tỉ mỉ từ nguyên liệu tươi thượng hạng.',
        price: (item.product.unitPrice || 0).toLocaleString('vi-VN') + ' đ',
        rawPrice: item.product.unitPrice || 0,
        rating: '4.9',
        image:
          item.product.primaryImage?.image?.url ||
          'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
        category: item.product.categoryName || 'Tất cả',
        isChefSpecial: true,
      }))
    : DISHES.map((d) => ({
        ...d,
        rawPrice: d.price,
        price: d.priceFormatted,
        isChefSpecial: Boolean(d.badge?.includes('Bếp trưởng')),
      }));

  const filteredDishes = savedDishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      dish.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesChef = !chefSpecialsOnly || dish.isChefSpecial;
    return matchesCategory && matchesChef;
  });

  const totalSavedAmount = filteredDishes.reduce((sum, d) => sum + (d.rawPrice || 0), 0);

  const removeSaved = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch (err) {
      Alert.alert('Thông báo', err instanceof Error ? err.message : 'Không thể xóa món yêu thích');
    }
  };

  const handleAddToCart = async (dishId: string, dishName: string) => {
    try {
      await addToCart(dishId);
      Alert.alert('Thành công', `Đã thêm ${dishName} vào giỏ hàng`, [
        { text: 'Xem giỏ hàng', onPress: () => router.push('/cart') },
        { text: 'Tiếp tục', style: 'cancel' },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleAddAllToCart = async () => {
    try {
      await moveAllToCart();
      Alert.alert(
        'Thêm vào giỏ hàng',
        'Đã chuyển tất cả các món ăn đang sẵn sàng vào giỏ hàng của bạn.',
        [
          {
            text: 'Xem giỏ hàng',
            onPress: () => router.push('/cart'),
          },
          { text: 'Tiếp tục xem', style: 'cancel' },
        ]
      );
    } catch (err) {
      Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể chuyển vào giỏ hàng');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Top Navigation Bar */}
      <View style={styles.topHeader}>
        <View style={styles.branchRow}>
          <View style={styles.storeIconWrap}>
            <Icon name="storefront" size={20} color={ArtisanColors.primary} fill />
          </View>
          <View>
            <Text style={styles.brandTitle}>ARTISAN KITCHEN</Text>
            <Text style={styles.branchName}>{activeBranch?.name || CURRENT_BRANCH.name}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Tìm kiếm"
            onPress={() => router.push('/menu')}
            style={({ pressed }) => [styles.headerIconBtn, pressed && styles.pressed]}>
            <Icon name="search" size={22} color={ArtisanColors.onSurfaceVariant} />
          </Pressable>
          <Pressable
            accessibilityLabel="Thông báo"
            onPress={() =>
              Alert.alert('Thông báo', 'Bạn có ưu đãi giảm 15% cho bữa tối nay!')
            }
            style={({ pressed }) => [styles.headerIconBtn, pressed && styles.pressed]}>
            <Icon name="notifications" size={22} color={ArtisanColors.onSurfaceVariant} />
            <View style={styles.badgeDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 2. Screen Title & Meta Context */}
        <View style={styles.titleSection}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.pageTitle}>Danh sách yêu thích</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{filteredDishes.length} món</Text>
              </View>
            </View>
            <Text style={styles.pageSubtitle}>
              Lựa chọn ẩm thực theo mùa cho bàn ăn của bạn
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Sắp xếp"
            onPress={() =>
              Alert.alert('Sắp xếp theo', 'Phổ biến nhất, Giá tăng dần, Đánh giá cao nhất.')
            }
            style={({ pressed }) => [styles.sortBtn, pressed && styles.pressed]}>
            <Icon name="tune" size={16} color={ArtisanColors.onSurfaceVariant} />
            <Text style={styles.sortBtnText}>Sắp xếp</Text>
          </Pressable>
        </View>

        {/* 3. Category Filter Chips (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTrack}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  isSelected ? styles.categoryChipActive : styles.categoryChipInactive,
                ]}>
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected ? styles.categoryChipTextActive : styles.categoryChipTextInactive,
                  ]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 4. Quick Toggles / Stock Availability Bar */}
        <View style={styles.quickToggleCard}>
          <View style={styles.stockAvailability}>
            <Icon name="check_circle" size={18} color={ArtisanColors.tertiary} fill />
            <Text style={styles.stockText}>Còn hàng / Sẵn sàng hôm nay</Text>
          </View>

          <View style={styles.chefSpecialsToggle}>
            <Text style={styles.chefSpecialsLabel}>Món bếp trưởng</Text>
            <Switch
              value={chefSpecialsOnly}
              onValueChange={setChefSpecialsOnly}
              trackColor={{
                false: ArtisanColors.surfaceContainerHigh,
                true: ArtisanColors.primary,
              }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* 5. Bulk Action Bar */}
        <View style={styles.bulkActionBar}>
          <View>
            <Text style={styles.bulkTitle}>Sẵn sàng gọi món?</Text>
            <Text style={styles.bulkSubtitle}>
              {filteredDishes.length} món sẵn sàng phục vụ • {totalSavedAmount.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={handleAddAllToCart}
            style={({ pressed }) => [styles.bulkAddBtn, pressed && styles.pressed]}>
            <Icon name="shopping_bag" size={18} color="#ffffff" />
            <Text style={styles.bulkAddBtnText}>Thêm tất cả</Text>
          </Pressable>
        </View>

        {/* 6. Wishlist Food Cards Feed */}
        {filteredDishes.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="favorite" size={48} color={ArtisanColors.outlineVariant} />
            <Text style={styles.emptyTitle}>Chưa có món yêu thích</Text>
            <Text style={styles.emptySub}>
              Hãy thả tim các món ăn thơm ngon trong thực đơn để lưu lại tại đây!
            </Text>
            <Pressable
              onPress={() => router.push('/menu')}
              style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}>
              <Text style={styles.exploreBtnText}>Khám phá thực đơn</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.dishFeed}>
            {filteredDishes.map((dish, idx) => (
              <Pressable
                key={dish.id}
                onPress={() => router.push({ pathname: '/food-detail', params: { id: dish.id } })}
                style={({ pressed }) => [styles.dishCard, pressed && styles.pressed]}>
                <View style={styles.dishCardInner}>
                  {/* Dish Image */}
                  <View style={styles.imageBox}>
                    <Image
                      source={{ uri: dish.image }}
                      style={styles.dishImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.dishTagBadge}>
                      <Text style={styles.dishTagText}>
                        {idx % 2 === 0 ? 'Bếp trưởng chọn' : 'Bán chạy nhất'}
                      </Text>
                    </View>
                  </View>

                  {/* Dish Info */}
                  <View style={styles.dishInfo}>
                    <View>
                      <View style={styles.dishHeaderRow}>
                        <Text style={styles.dishName} numberOfLines={1}>
                          {dish.name}
                        </Text>
                        <Pressable
                          accessibilityLabel="Bỏ lưu yêu thích"
                          onPress={(e) => {
                            e.stopPropagation();
                            removeSaved(dish.id);
                          }}
                          style={styles.heartBtn}>
                          <Icon
                            name="favorite"
                            size={20}
                            color={ArtisanColors.primary}
                            fill
                          />
                        </Pressable>
                      </View>

                      <Text style={styles.dishDesc} numberOfLines={2}>
                        {dish.subtitle} • {dish.description}
                      </Text>

                      <View style={styles.ratingRow}>
                        <Icon name="star" size={14} color="#f59e0b" fill />
                        <Text style={styles.ratingScore}>{dish.rating}</Text>
                        <Text style={styles.ratingCount}>(128 đánh giá)</Text>
                      </View>
                    </View>

                    {/* Bottom Row: Price & Add button */}
                    <View style={styles.cardBottomRow}>
                      <Text style={styles.priceText}>{dish.price}</Text>
                      <Pressable
                        accessibilityLabel="Thêm vào giỏ hàng"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAddToCart(dish.id, dish.name);
                        }}
                        style={({ pressed }) => [styles.addToCartBtn, pressed && styles.pressed]}>
                        <Icon name="add" size={18} color="#ffffff" />
                        <Text style={styles.addToCartBtnText}>Thêm vào giỏ</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Persistent Bottom Tabs */}
      <BottomNavigation currentTab="saved" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ArtisanColors.background,
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
    height: 60,
    backgroundColor: ArtisanColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ArtisanColors.outlineVariant,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ArtisanColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 0.5,
  },
  branchName: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ArtisanColors.primary,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: ArtisanColors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  pageSubtitle: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ArtisanColors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  categoryTrack: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#2A201C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryChipInactive: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainerHigh,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  categoryChipTextInactive: {
    color: ArtisanColors.onSurface,
  },
  quickToggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(216, 194, 188, 0.4)',
  },
  stockAvailability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  chefSpecialsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chefSpecialsLabel: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  bulkActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 235, 230, 0.6)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ArtisanColors.secondaryContainer,
  },
  bulkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  bulkSubtitle: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  bulkAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ArtisanColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bulkAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  dishFeed: {
    gap: 12,
  },
  dishCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 194, 188, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dishCardInner: {
    flexDirection: 'row',
    gap: 12,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: ArtisanColors.surfaceContainer,
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  dishTagBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(42, 32, 28, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dishTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginRight: 4,
  },
  heartBtn: {
    padding: 2,
  },
  dishDesc: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    lineHeight: 16,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  ratingCount: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ArtisanColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addToCartBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  emptySub: {
    fontSize: 13,
    color: ArtisanColors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: ArtisanColors.primary,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

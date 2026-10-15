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
import { TopHeader } from '@/components/top-header';
import { CURRENT_BRANCH, MOCK_CART } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { useCart } from '@/features/cart';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { activeBranch } = useBranches();
  const {
    items: liveCartItems,
    updateQuantity: apiUpdateQuantity,
    removeItem: apiRemoveItem,
    subtotal: apiSubtotal,
  } = useCart(activeBranch?.id);

  const [selectedTip, setSelectedTip] = useState('15%');
  const [promoCode, setPromoCode] = useState('TRUFFLE25');
  const [promoApplied, setPromoApplied] = useState(true);

  // Ánh xạ danh sách món trong giỏ từ backend hoặc fallback
  const cartItems = liveCartItems.length > 0
    ? liveCartItems.map((it) => ({
        id: it.product.id,
        dishId: it.product.id,
        name: it.product.name,
        customization: it.product.categoryName || 'Món chính',
        price: it.product.unitPrice || 0,
        basePrice: it.product.unitPrice || 0,
        quantity: it.quantity,
        image:
          it.product.primaryImage?.image?.url ||
          'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
      }))
    : MOCK_CART;

  const updateQuantity = async (id: string, delta: number) => {
    const it = cartItems.find((item) => item.id === id);
    if (!it) return;
    const newQty = it.quantity + delta;
    try {
      await apiUpdateQuantity(id, newQty);
    } catch {
      // Lỗi được log trong hook
    }
  };

  const removeItem = async (id: string) => {
    try {
      await apiRemoveItem(id);
    } catch {
      // Lỗi được log trong hook
    }
  };

  const clearCart = () => {
    // Có thể xóa từng item
  };

  const subtotal = liveCartItems.length > 0
    ? apiSubtotal
    : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = promoApplied && subtotal > 0 ? 60000 : 0;
  const tipPercent = selectedTip === '10%' ? 0.1 : selectedTip === '15%' ? 0.15 : selectedTip === '20%' ? 0.2 : 0;
  const tipAmount = Math.round(subtotal * tipPercent);
  const tax = Math.round(subtotal * 0.08);
  const total = Math.max(0, subtotal - discount + tax + tipAmount);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <TopHeader
        title={activeBranch?.name || CURRENT_BRANCH.name}
        showBack
        showBranch={false}
        showNotifications
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Cart Sub-Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            Giỏ hàng của bạn <Text style={styles.countText}>({cartItems.length} món)</Text>
          </Text>
          {cartItems.length > 0 && (
            <Pressable
              onPress={clearCart}
              style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}>
              <Icon name="delete_sweep" size={18} color={ArtisanColors.onSurfaceVariant} />
              <Text style={styles.clearBtnText}>Xóa tất cả</Text>
            </Pressable>
          )}
        </View>

        {/* Pickup Branch Banner */}
        <View style={styles.branchBanner}>
          <View style={styles.branchBannerLeft}>
            <View style={styles.clockIconWrap}>
              <Icon name="schedule" size={20} color={ArtisanColors.primary} />
            </View>
            <View style={styles.branchBannerInfo}>
              <View style={styles.branchStatusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.branchBannerLabel}>ĐIỂM NHẬN MÓN</Text>
              </View>
              <Text style={styles.branchBannerName} numberOfLines={1}>
                {CURRENT_BRANCH.name} <Text style={styles.branchTime}>({CURRENT_BRANCH.prepTime})</Text>
              </Text>
            </View>
          </View>
          <Pressable style={styles.changeBranchBtn}>
            <Text style={styles.changeBranchText}>Đổi chi nhánh</Text>
          </Pressable>
        </View>

        {/* Cart Items List */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="shopping_bag" size={54} color={ArtisanColors.outlineVariant} />
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySub}>Khám phá thực đơn và chọn món ngon yêu thích nhé!</Text>
            <Pressable
              onPress={() => router.push('/menu')}
              style={({ pressed }) => [styles.exploreMenuBtn, pressed && styles.pressed]}>
              <Text style={styles.exploreMenuText}>Xem thực đơn ngay</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemImageWrap}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      contentFit="cover"
                      transition={200}
                    />
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.itemNameRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Pressable
                        accessibilityLabel="Xóa món"
                        onPress={() => removeItem(item.id)}
                        style={styles.deleteBtn}>
                        <Icon name="delete" size={18} color={ArtisanColors.onSurfaceVariant} />
                      </Pressable>
                    </View>

                    <Text style={styles.itemCustomization} numberOfLines={1}>
                      {item.customization}
                    </Text>

                    <View style={styles.itemPriceRow}>
                      <Text style={styles.itemPrice}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </Text>
                      {item.quantity > 1 && (
                        <Text style={styles.itemBasePrice}>
                          ({item.price.toLocaleString('vi-VN')} đ / phần)
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Bottom Bar: Customized Recipe Label + Stepper */}
                <View style={styles.itemBottomRow}>
                  <Text style={styles.customRecipeText}>Công thức tùy chỉnh</Text>
                  <View style={styles.stepper}>
                    <Pressable
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.stepBtn}>
                      <Icon name="remove" size={16} color={ArtisanColors.onSurface} />
                    </Pressable>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.stepBtn}>
                      <Icon name="add" size={16} color={ArtisanColors.onSurface} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            {/* Promo Code Input */}
            <View style={styles.promoCard}>
              <View style={styles.promoInputRow}>
                <Icon name="stars" size={20} color={ArtisanColors.primary} fill />
                <TextInput
                  style={styles.promoInput}
                  placeholder="Nhập mã ưu đãi"
                  placeholderTextColor={ArtisanColors.outline}
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
                <Pressable
                  onPress={() => setPromoApplied(!promoApplied)}
                  style={[styles.applyBtn, promoApplied && styles.applyBtnActive]}>
                  <Text style={[styles.applyBtnText, promoApplied && styles.applyBtnTextActive]}>
                    {promoApplied ? 'Đã áp dụng ✓' : 'Áp dụng'}
                  </Text>
                </Pressable>
              </View>
              {promoApplied && (
                <Text style={styles.promoSuccessText}>
                  Lễ hội Nấm Truffle: Đã áp dụng giảm -60.000 đ!
                </Text>
              )}
            </View>

            {/* Tip Selector */}
            <View style={styles.tipSection}>
              <Text style={styles.tipHeader}>Tiền tip cho đội ngũ bếp</Text>
              <View style={styles.tipGrid}>
                {['10%', '15%', '20%', 'Tùy chọn'].map((tip) => {
                  const isSelected = selectedTip === tip;
                  return (
                    <Pressable
                      key={tip}
                      onPress={() => setSelectedTip(tip)}
                      style={[styles.tipChip, isSelected && styles.tipChipSelected]}>
                      <Text
                        style={[
                          styles.tipChipText,
                          isSelected && styles.tipChipTextSelected,
                        ]}>
                        {tip}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryVal}>{subtotal.toLocaleString('vi-VN')} đ</Text>
              </View>

              {promoApplied && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ưu đãi Lễ hội Truffle</Text>
                  <Text style={styles.summaryDiscount}>-{discount.toLocaleString('vi-VN')} đ</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Thuế GTGT & Dịch vụ (8%)</Text>
                <Text style={styles.summaryVal}>{tax.toLocaleString('vi-VN')} đ</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền tip ({selectedTip})</Text>
                <Text style={styles.summaryVal}>{tipAmount.toLocaleString('vi-VN')} đ</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalVal}>{total.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Docked Checkout CTA Bar */}
      {cartItems.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/checkout')}
            style={({ pressed }) => [styles.checkoutBtn, pressed && styles.pressed]}>
            <View style={styles.lockIcon}>
              <Icon name="shield" size={18} color="#ffffff" fill />
            </View>
            <Text style={styles.checkoutBtnText}>
              Tiến hành thanh toán • {total.toLocaleString('vi-VN')} đ
            </Text>
          </Pressable>
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.4,
  },
  countText: {
    fontSize: 17,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: ArtisanColors.surfaceContainerLow,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  branchBanner: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  branchBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  clockIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ArtisanColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchBannerInfo: {
    flex: 1,
  },
  branchStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.tertiary,
  },
  branchBannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 0.6,
  },
  branchBannerName: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginTop: 2,
  },
  branchTime: {
    fontWeight: '400',
    color: ArtisanColors.secondary,
  },
  changeBranchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: ArtisanColors.surfaceContainer,
  },
  changeBranchText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  emptySub: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  exploreMenuBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: ArtisanColors.primary,
  },
  exploreMenuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemsList: {
    marginTop: 14,
    gap: 12,
  },
  itemCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  itemTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: ArtisanColors.surfaceContainer,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    flex: 1,
  },
  deleteBtn: {
    padding: 2,
  },
  itemCustomization: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  itemBasePrice: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: ArtisanColors.surfaceContainerLow,
  },
  customRecipeText: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 18,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    width: 28,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  promoCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 6,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 38,
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainer,
  },
  applyBtnActive: {
    backgroundColor: 'rgba(0, 105, 71, 0.1)',
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  applyBtnTextActive: {
    color: ArtisanColors.tertiary,
  },
  promoSuccessText: {
    fontSize: 11,
    color: ArtisanColors.tertiary,
    fontWeight: '600',
  },
  tipSection: {
    gap: 8,
  },
  tipHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  tipGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipChipSelected: {
    borderColor: ArtisanColors.primary,
    backgroundColor: 'rgba(173, 44, 0, 0.06)',
  },
  tipChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  tipChipTextSelected: {
    color: ArtisanColors.primary,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  summaryDiscount: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(143, 112, 104, 0.2)',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ArtisanColors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(143, 112, 104, 0.2)',
    paddingTop: 12,
    paddingHorizontal: 16,
    zIndex: 50,
    ...Platform.select({
      web: {
        maxWidth: 520,
        marginHorizontal: 'auto' as any,
      },
    }),
  },
  checkoutBtn: {
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
  lockIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});

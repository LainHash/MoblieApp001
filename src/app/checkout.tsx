import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { useCart } from '@/features/cart';
import { useCheckout } from '@/features/orders';
import { useUserProfile } from '@/features/user';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { activeBranch } = useBranches();
  const { items: liveCartItems, subtotal: apiSubtotal, isLoading: isCartLoading } = useCart(activeBranch?.id);
  const { user, profile } = useUserProfile();
  const { submitOrder, isSubmitting } = useCheckout();

  const [showItemDetails, setShowItemDetails] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'qr' | 'cash'>('qr');

  const cartItems = liveCartItems.map((it) => ({
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
  }));

  const subtotal = apiSubtotal;
  const discount = 0;
  const tax = Math.round(subtotal * 0.08);
  const tip = Math.round(subtotal * 0.15);
  const total = Math.max(0, subtotal - discount + tax + tip);

  const receiverName = profile
    ? `${profile.lastName} ${profile.firstName}`.trim()
    : user?.userName || 'Quý khách';
  const receiverPhone = profile?.phone || 'Chưa cập nhật';
  const deliveryAddress = profile?.address
    ? `${profile.address}${profile.city ? `, ${profile.city}` : ''}`
    : activeBranch?.address || 'Tại nhà hàng';

  const handleConfirmOrder = async () => {
    try {
      const orderItems = liveCartItems.map((it) => ({
        productId: it.product.id,
        quantity: it.quantity,
      }));

      const res = await submitOrder({
        branchId: activeBranch?.id || '00000000-0000-0000-0000-000000000000',
        deliveryAddress,
        note: 'Đơn đặt từ ứng dụng Mobile',
        deliveryFee: 15000,
        items: orderItems.length > 0 ? orderItems : undefined,
      });

      router.replace({
        pathname: '/order-confirmed',
        params: {
          orderId: res?.order?.id,
          orderCode: res?.order?.orderCode,
          qrUrl: res?.payment?.qrCodeUrl,
          amount: String(res?.payment?.amount || total),
          transferContent: res?.payment?.transferContent,
        },
      });
    } catch (err) {
      Alert.alert(
        'Lỗi đặt hàng',
        err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
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

        <Text style={styles.topBarTitle}>Thanh toán đơn hàng</Text>

        <Pressable
          accessibilityLabel="Trợ giúp"
          style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
          <Icon name="help_outline" size={20} color={ArtisanColors.secondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 1. Pickup Branch Card */}
        <View style={styles.card}>
          <View style={styles.branchHeaderRow}>
            <View style={styles.branchIconWrap}>
              <Icon name="storefront" size={22} color={ArtisanColors.primary} fill />
            </View>
            <View style={styles.branchInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.pickupBadge}>
                  <Text style={styles.pickupBadgeText}>TỰ ĐẾN LẤY</Text>
                </View>
                <View style={styles.readyBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.readyText}>Sẵn sàng trong 15-20 phút</Text>
                </View>
              </View>
              <Text style={styles.branchName}>{activeBranch?.name || 'Chi nhánh nhà hàng'}</Text>
              <Text style={styles.branchAddress}>
                {activeBranch?.address ? `${activeBranch.address}${activeBranch.city ? `, ${activeBranch.city}` : ''}` : 'Địa chỉ chi nhánh đang cập nhật'}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Order Items Review Card */}
        <View style={styles.card}>
          <Pressable
            onPress={() => setShowItemDetails(!showItemDetails)}
            style={styles.cardTitleRow}>
            <View style={styles.titleWithCount}>
              <Text style={styles.cardTitle}>Món ăn đã chọn</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{cartItems.length} món</Text>
              </View>
            </View>
            <View style={styles.detailToggle}>
              <Text style={styles.detailToggleText}>
                {showItemDetails ? 'Thu gọn' : 'Chi tiết'}
              </Text>
              <Icon
                name={showItemDetails ? 'expand_less' : 'expand_more'}
                size={18}
                color={ArtisanColors.secondary}
              />
            </View>
          </Pressable>

          {showItemDetails && (
            <View style={styles.itemsList}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemQtyBadge}>
                    <Text style={styles.itemQtyText}>{item.quantity}x</Text>
                  </View>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCustom}>{item.customization}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 3. Customer Contact Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Thông tin người nhận</Text>
            <Pressable onPress={() => router.push('/edit-profile')}>
              <Text style={styles.editText}>Thay đổi</Text>
            </Pressable>
          </View>

          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Icon name="person" size={18} color={ArtisanColors.secondary} />
              <View>
                <Text style={styles.contactLabel}>Họ và tên</Text>
                <Text style={styles.contactVal}>{receiverName}</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <Icon name="call" size={18} color={ArtisanColors.secondary} />
              <View>
                <Text style={styles.contactLabel}>Số điện thoại</Text>
                <Text style={styles.contactVal}>{receiverPhone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Payment Methods Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức thanh toán</Text>

          {[
            {
              id: 'qr',
              title: 'Chuyển khoản VietQR / Ngân hàng',
              sub: 'Tạo mã VietQR quét thanh toán tức thì',
              icon: 'qr_code_2',
              badge: 'Khuyên dùng',
            },
            {
              id: 'wallet',
              title: 'Ví thành viên',
              sub: user?.roleName ? `Tài khoản (${user.roleName})` : 'Tài khoản thành viên',
              icon: 'account_balance_wallet',
            },
            {
              id: 'cash',
              title: 'Tiền mặt khi nhận món tại quầy',
              sub: 'Thanh toán trực tiếp cho thu ngân',
              icon: 'payments',
            },
          ].map((pm) => {
            const isSelected = paymentMethod === pm.id;
            return (
              <Pressable
                key={pm.id}
                onPress={() => setPaymentMethod(pm.id as any)}
                style={[styles.payRow, isSelected && styles.payRowSelected]}>
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.payIconBox}>
                  <Icon
                    name={pm.icon}
                    size={20}
                    color={isSelected ? ArtisanColors.primary : ArtisanColors.secondary}
                  />
                </View>
                <View style={styles.payTextWrap}>
                  <View style={styles.payTitleRow}>
                    <Text style={styles.payTitle}>{pm.title}</Text>
                    {pm.badge && (
                      <View style={styles.recommendBadge}>
                        <Text style={styles.recommendText}>{pm.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paySub}>{pm.sub}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 5. Cost Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tạm tính tiền món</Text>
            <Text style={styles.costVal}>{subtotal.toLocaleString('vi-VN')} đ</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Khuyến mãi Lễ hội Truffle</Text>
            <Text style={styles.discountVal}>-{discount.toLocaleString('vi-VN')} đ</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Thuế GTGT & Phí phục vụ (8%)</Text>
            <Text style={styles.costVal}>{tax.toLocaleString('vi-VN')} đ</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tiền tip đội ngũ bếp (15%)</Text>
            <Text style={styles.costVal}>{tip.toLocaleString('vi-VN')} đ</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng cần thanh toán</Text>
            <Text style={styles.totalVal}>{total.toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Docked Place Order CTA */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleConfirmOrder}
          style={({ pressed }) => [
            styles.confirmBtn,
            isSubmitting && { opacity: 0.7 },
            pressed && styles.pressed,
          ]}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Icon name="check_circle" size={20} color="#ffffff" fill />
              <Text style={styles.confirmBtnText}>
                Xác nhận đặt hàng • {total.toLocaleString('vi-VN')} đ
              </Text>
            </>
          )}
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
  topBar: {
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
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  card: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 12,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  branchHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  branchIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ArtisanColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  branchInfo: {
    flex: 1,
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickupBadge: {
    backgroundColor: ArtisanColors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pickupBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ArtisanColors.onPrimaryFixed,
    letterSpacing: 0.5,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.tertiary,
  },
  readyText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  branchName: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginTop: 2,
  },
  branchAddress: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  countBadge: {
    backgroundColor: ArtisanColors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  detailToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailToggleText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    fontWeight: '500',
  },
  itemsList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: ArtisanColors.surfaceContainerLow,
    paddingTop: 8,
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  itemQtyBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemQtyText: {
    fontSize: 11,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  itemCustom: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  contactGrid: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 10,
  },
  contactLabel: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  contactVal: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    marginTop: 1,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    backgroundColor: ArtisanColors.surfaceContainerLowest,
  },
  payRowSelected: {
    borderColor: ArtisanColors.primary,
    backgroundColor: 'rgba(173, 44, 0, 0.03)',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ArtisanColors.primary,
  },
  payIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payTextWrap: {
    flex: 1,
  },
  payTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  recommendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: ArtisanColors.secondaryContainer,
  },
  recommendText: {
    fontSize: 9,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  paySub: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    marginTop: 1,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  costVal: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  discountVal: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(143, 112, 104, 0.2)',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
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
    borderColor: 'rgba(143, 112, 104, 0.2)',
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
  confirmBtn: {
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
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

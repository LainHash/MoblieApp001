import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { ordersService, OrderDetailResponse, usePaymentStatusPolling } from '@/features/orders';

export default function OrderConfirmedScreen() {
  const { orderId, orderCode, qrUrl, amount, transferContent } = useLocalSearchParams<{
    orderId?: string;
    orderCode?: string;
    qrUrl?: string;
    amount?: string;
    transferContent?: string;
  }>();

  const { activeBranch } = useBranches();
  const [copied, setCopied] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(Boolean(orderId));

  const orderRef = orderCode ? `#${orderCode}` : orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : '#AK-ORDER';

  useEffect(() => {
    let ignore = false;
    if (!orderId) {
      setIsLoadingDetail(false);
      return;
    }
    async function loadOrder() {
      try {
        setIsLoadingDetail(true);
        const res = await ordersService.getOrderById(orderId!);
        if (!ignore) {
          setOrderDetail(res);
        }
      } catch {
        // Fallback to params
      } finally {
        if (!ignore) {
          setIsLoadingDetail(false);
        }
      }
    }
    loadOrder();
    return () => {
      ignore = true;
    };
  }, [orderId]);

  const { isPaid, isPolling } = usePaymentStatusPolling({
    orderId,
    enabled: Boolean(orderId),
  });

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const total = amount
    ? Number(amount)
    : orderDetail?.totalAmount || 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Icon name="storefront" size={22} color={ArtisanColors.primary} fill />
          <Text style={styles.topBarTitle}>{activeBranch?.name || 'Artisan Kitchen'}</Text>
        </View>
        <Pressable
          accessibilityLabel="Trang chủ"
          onPress={() => router.replace('/')}
          style={styles.closeBtn}>
          <Icon name="close" size={20} color={ArtisanColors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Celebratory Seal Card */}
        <View style={styles.celebrateCard}>
          <View style={styles.sealCircle}>
            <View style={styles.sealInner}>
              <Icon name="check" size={32} color="#ffffff" />
            </View>
            <View style={styles.chefBadge}>
              <Icon name="restaurant" size={14} color="#ffffff" fill />
            </View>
          </View>

          <Text style={styles.celebrateTitle}>Đặt hàng thành công!</Text>
          <Text style={styles.celebrateSub}>
            Bếp trưởng đã tiếp nhận đơn và đang chuẩn bị những món ngon nóng hổi nhất cho bạn.
          </Text>

          {/* Order Ref Chip */}
          <Pressable onPress={handleCopy} style={styles.orderRefPill}>
            <Text style={styles.orderRefLabel}>MÃ ĐƠN HÀNG</Text>
            <Text style={styles.orderRefVal}>{orderRef}</Text>
            <View style={styles.copyBtn}>
              <Icon name={copied ? 'check' : 'content_copy'} size={15} color={ArtisanColors.primary} />
              <Text style={styles.copyText}>{copied ? 'Đã sao chép' : 'Sao chép'}</Text>
            </View>
          </Pressable>
        </View>

        {/* Live Wait Time & Kitchen Status */}
        <View style={styles.infoCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.clockBox}>
              <Icon name="schedule" size={20} color={ArtisanColors.onPrimaryFixed} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>THỜI GIAN CHỜ DỰ KIẾN</Text>
              <Text style={styles.statusValue}>Sẵn sàng sau ~18 phút</Text>
            </View>
            <View style={styles.sentKitchenBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.sentKitchenText}>Đã gửi đến bếp</Text>
            </View>
          </View>

          {/* Step Progress Line */}
          <View style={styles.progressWrap}>
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarActive} />
            </View>
            <View style={styles.progressStepsRow}>
              <Text style={styles.stepActive}>1. Đã nhận đơn</Text>
              <Text style={styles.stepMuted}>2. Đang chế biến</Text>
              <Text style={styles.stepMuted}>3. Sẵn sàng nhận</Text>
            </View>
          </View>
        </View>

        {/* VietQR SePay Card (if available) */}
        {qrUrl ? (
          <View style={styles.qrCard}>
            <View style={styles.qrHeaderRow}>
              <View style={styles.qrHeaderLeft}>
                <Icon name="qr_code_scanner" size={20} color={ArtisanColors.primary} />
                <Text style={styles.qrCardTitle}>Thanh toán VietQR qua SePay</Text>
              </View>
              {isPaid ? (
                <View style={styles.paidBadge}>
                  <Icon name="check_circle" size={14} color="#ffffff" fill />
                  <Text style={styles.paidBadgeText}>Đã thanh toán</Text>
                </View>
              ) : (
                <View style={styles.pendingBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.pendingBadgeText}>
                    {isPolling ? 'Đang xác nhận...' : 'Chờ thanh toán'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.qrImageWrapper}>
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.qrDetailsBox}>
              <View style={styles.qrDetailRow}>
                <Text style={styles.qrDetailLabel}>Số tiền:</Text>
                <Text style={styles.qrDetailValueHighlight}>
                  {total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
              {transferContent ? (
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Nội dung:</Text>
                  <Text style={styles.qrDetailValue}>{transferContent}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.qrNoteText}>
              {isPaid
                ? 'Hệ thống đã nhận được tiền. Cảm ơn quý khách!'
                : 'Mở ứng dụng ngân hàng bất kỳ để quét mã QR chuyển khoản chính xác nội dung trên.'}
            </Text>
          </View>
        ) : null}

        {/* Counter Pickup Instructions */}
        <View style={styles.infoCard}>
          <View style={styles.pickupHeader}>
            <View style={styles.locIconWrap}>
              <Icon name="location_on" size={20} color={ArtisanColors.primary} fill />
            </View>
            <View style={styles.pickupInfo}>
              <View style={styles.pickupBadgeRow}>
                <Text style={styles.pickupTitle}>
                  {activeBranch?.name || 'Artisan Kitchen • Trung tâm'}
                </Text>
                <View style={styles.counterBadge}>
                  <Text style={styles.counterBadgeText}>Nhận tại quầy</Text>
                </View>
              </View>
              <Text style={styles.pickupAddress}>
                {activeBranch?.address || '720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM'}
              </Text>
            </View>
          </View>

          <View style={styles.instructionBox}>
            <Icon name="info" size={18} color={ArtisanColors.primary} />
            <Text style={styles.instructionText}>
              Vui lòng đến <Text style={styles.boldPrimary}>Quầy Bistro Express</Text> tại sảnh chính và đưa mã đơn <Text style={styles.boldText}>{orderRef}</Text> cho nhân viên phục vụ khi đến nhận món.
            </Text>
          </View>
        </View>

        {/* Order Summary Preview */}
        <View style={styles.infoCard}>
          <View style={styles.summaryTitleRow}>
            <Text style={styles.cardHeaderTitle}>
              Chi tiết đơn hàng {orderDetail ? `(${orderDetail.orderItems?.length || 0} món)` : ''}
            </Text>
            <Text style={styles.tablewareText}>Bao gồm dụng cụ ăn</Text>
          </View>

          {isLoadingDetail ? (
            <View style={{ paddingVertical: 16, alignItems: 'center', gap: 6 }}>
              <ActivityIndicator size="small" color={ArtisanColors.primary} />
              <Text style={{ fontSize: 13, color: ArtisanColors.secondary }}>
                Đang tải chi tiết đơn hàng...
              </Text>
            </View>
          ) : orderDetail?.orderItems && orderDetail.orderItems.length > 0 ? (
            <View style={styles.orderItemsList}>
              {orderDetail.orderItems.map((item, idx) => (
                <View key={item.id || idx} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemName}>
                    {item.quantity}x {item.productName || `Món ăn #${idx + 1}`}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    {(item.total || (item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.orderItemsList}>
              <View style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName}>Đơn đặt món trực tuyến</Text>
                <Text style={styles.summaryItemPrice}>{total.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryItemRow}>
            <Text style={styles.paidLabel}>Tổng thanh toán</Text>
            <Text style={styles.paidTotal}>{total.toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/orders')}
            style={({ pressed }) => [styles.trackBtn, pressed && styles.pressed]}>
            <Icon name="receipt_long" size={18} color="#ffffff" />
            <Text style={styles.trackBtnText}>Theo dõi tiến độ đơn hàng</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.homeBtn, pressed && styles.pressed]}>
            <Text style={styles.homeBtnText}>Quay về trang chủ</Text>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(143, 112, 104, 0.15)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  celebrateCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  sealCircle: {
    position: 'relative',
    marginBottom: 4,
  },
  sealInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ArtisanColors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chefBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ArtisanColors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  celebrateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  celebrateSub: {
    fontSize: 13,
    color: ArtisanColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
  },
  orderRefPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    marginTop: 6,
  },
  orderRefLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 0.5,
  },
  orderRefVal: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 4,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderColor: 'rgba(143, 112, 104, 0.2)',
  },
  copyText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  infoCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 12,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  clockBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ArtisanColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 0.6,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    marginTop: 1,
  },
  sentKitchenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 105, 71, 0.1)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.tertiary,
  },
  sentKitchenText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  progressWrap: {
    gap: 6,
    paddingTop: 4,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.surfaceContainer,
    overflow: 'hidden',
  },
  progressBarActive: {
    width: '40%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: ArtisanColors.primary,
  },
  progressStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepActive: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  stepMuted: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  pickupHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  locIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ArtisanColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupInfo: {
    flex: 1,
  },
  pickupBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: ArtisanColors.primaryFixed,
  },
  counterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.onPrimaryFixed,
  },
  pickupAddress: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    marginTop: 2,
  },
  instructionBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    alignItems: 'flex-start',
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: ArtisanColors.onSurface,
    lineHeight: 17,
  },
  boldPrimary: {
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  boldText: {
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ArtisanColors.surfaceContainerLow,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  tablewareText: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  orderItemsList: {
    gap: 8,
  },
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItemName: {
    fontSize: 13,
    color: ArtisanColors.onSurface,
  },
  summaryItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(143, 112, 104, 0.2)',
  },
  paidLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  paidTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  actionButtonGroup: {
    gap: 10,
    marginTop: 4,
  },
  trackBtn: {
    height: 50,
    borderRadius: 25,
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
  trackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  homeBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  qrCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(189, 44, 0, 0.15)',
    gap: 12,
  },
  qrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  qrHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(189, 44, 0, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  qrImageWrapper: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
  },
  qrDetailsBox: {
    width: '100%',
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  qrDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrDetailLabel: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  qrDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  qrDetailValueHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  qrNoteText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    lineHeight: 17,
  },
});

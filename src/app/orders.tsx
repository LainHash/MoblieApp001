import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/bottom-navigation';
import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';
import { useBranches } from '@/features/branches';
import { OrderResponse, OrderStatus, OrderTab, useOrders } from '@/features/orders';

function getStatusDetails(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Pending:
      return { label: 'Chờ duyệt', color: ArtisanColors.primary, step: 1, eta: 'Đang gửi tới nhà hàng' };
    case OrderStatus.Confirmed:
      return { label: 'Đã xác nhận', color: '#0284c7', step: 2, eta: 'Đơn đã được nhà hàng tiếp nhận' };
    case OrderStatus.Processing:
      return { label: 'Đang chế biến', color: ArtisanColors.primary, step: 3, eta: 'Bếp trưởng đang hoàn thiện món ăn' };
    case OrderStatus.ReadyForPickup:
      return { label: 'Sẵn sàng nhận', color: '#16a34a', step: 4, eta: 'Món ăn đã sẵn sàng tại quầy' };
    case OrderStatus.Delivering:
      return { label: 'Đang giao hàng', color: '#0284c7', step: 4, eta: 'Tài xế đang giao đến địa chỉ của bạn' };
    case OrderStatus.Completed:
      return { label: 'Đã hoàn tất', color: ArtisanColors.tertiary, step: 5, eta: 'Đơn hàng hoàn tất' };
    case OrderStatus.Cancelled:
      return { label: 'Đã hủy', color: '#6b7280', step: 0, eta: 'Đơn hàng đã hủy' };
    default:
      return { label: 'Đang xử lý', color: ArtisanColors.primary, step: 2, eta: 'Đang xử lý' };
  }
}

export default function OrdersScreen() {
  const { activeBranch } = useBranches();
  const {
    orders,
    rawOrders,
    activeTab,
    setActiveTab,
    isLoading,
    cancelOrder,
    refetch,
  } = useOrders('all', activeBranch?.id);

  const activeCount = rawOrders.filter(
    (o) =>
      o.status === OrderStatus.Pending ||
      o.status === OrderStatus.Confirmed ||
      o.status === OrderStatus.Processing ||
      o.status === OrderStatus.ReadyForPickup ||
      o.status === OrderStatus.Delivering
  ).length;

  const handleCancelOrder = (order: OrderResponse) => {
    Alert.alert(
      'Hủy đơn hàng',
      `Bạn có chắc chắn muốn hủy đơn hàng #${order.orderCode || order.id.slice(0, 8)}?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đơn',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(order.id);
              Alert.alert('Thành công', 'Đơn hàng đã được hủy.');
            } catch (err) {
              Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể hủy đơn hàng');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Top Navigation Bar */}
      <View style={styles.topHeader}>
        <View style={styles.branchHeaderRow}>
          <View style={styles.storeIconWrap}>
            <Icon name="storefront" size={20} color={ArtisanColors.primary} fill />
          </View>
          <View>
            <Text style={styles.branchSubtitle}>{activeBranch?.name || 'Artisan Kitchen'}</Text>
            <Text style={styles.headerTitle}>Đơn của tôi</Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Làm mới"
          onPress={() => refetch()}
          style={({ pressed }) => [styles.notifBtn, pressed && styles.pressed]}>
          <Icon name="refresh" size={22} color={ArtisanColors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={ArtisanColors.primary} />
        }>
        {/* 2. Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabTrack}>
          {[
            { key: 'all' as OrderTab, label: 'Tất cả đơn' },
            { key: 'active' as OrderTab, label: 'Đang xử lý', count: activeCount },
            { key: 'completed' as OrderTab, label: 'Đã hoàn thành' },
            { key: 'cancelled' as OrderTab, label: 'Đã hủy' },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabChip,
                  isSelected ? styles.tabChipActive : styles.tabChipInactive,
                ]}>
                <Text
                  style={[
                    styles.tabChipText,
                    isSelected ? styles.tabChipTextActive : styles.tabChipTextInactive,
                  ]}>
                  {tab.label}
                </Text>
                {tab.count !== undefined && tab.count > 0 && (
                  <View
                    style={[
                      styles.tabCountBadge,
                      isSelected && styles.tabCountBadgeActive,
                    ]}>
                    <Text
                      style={[
                        styles.tabCountText,
                        isSelected && styles.tabCountTextActive,
                      ]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Loading Indicator */}
        {isLoading && orders.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ArtisanColors.primary} />
            <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
          </View>
        ) : null}

        {/* Orders List */}
        {orders.length > 0 ? (
          orders.map((order) => {
            const statusInfo = getStatusDetails(order.status);
            const isActiveOrder =
              order.status === OrderStatus.Pending ||
              order.status === OrderStatus.Confirmed ||
              order.status === OrderStatus.Processing ||
              order.status === OrderStatus.ReadyForPickup ||
              order.status === OrderStatus.Delivering;

            if (isActiveOrder) {
              return (
                <View key={order.id} style={styles.bentoCard}>
                  {/* Header Meta */}
                  <View style={styles.bentoHeader}>
                    <View>
                      <View style={styles.orderIdRow}>
                        <Text style={styles.orderIdText}>
                          Đơn #{order.orderCode || order.id.slice(0, 8).toUpperCase()}
                        </Text>
                        <View style={styles.inKitchenBadge}>
                          <View style={styles.pulseDot} />
                          <Text style={styles.inKitchenText}>{statusInfo.label}</Text>
                        </View>
                      </View>
                      <Text style={styles.orderTimeText}>
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        •{' '}
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </Text>
                    </View>

                    <View style={styles.branchBox}>
                      <Text style={styles.branchLabel}>CHI NHÁNH</Text>
                      <Text style={styles.branchNameBold}>
                        {order.branchCode || activeBranch?.name || 'Artisan Kitchen'}
                      </Text>
                    </View>
                  </View>

                  {/* Stepper Timeline */}
                  <View style={styles.timelineSection}>
                    <View style={styles.progressLineBg} />
                    <View
                      style={[
                        styles.progressLineActive,
                        { width: `${Math.min(100, Math.max(10, statusInfo.step * 24))}%` },
                      ]}
                    />

                    <View style={styles.stepsRow}>
                      <View style={styles.stepItem}>
                        <View
                          style={
                            statusInfo.step >= 1
                              ? styles.stepCircleCompleted
                              : styles.stepCirclePending
                          }>
                          {statusInfo.step >= 1 ? (
                            <Icon name="check" size={14} color="#ffffff" />
                          ) : (
                            <View style={styles.pendingDot} />
                          )}
                        </View>
                        <Text style={styles.stepLabel}>Chờ duyệt</Text>
                      </View>

                      <View style={styles.stepItem}>
                        <View
                          style={
                            statusInfo.step >= 2
                              ? styles.stepCircleCompleted
                              : styles.stepCirclePending
                          }>
                          {statusInfo.step >= 2 ? (
                            <Icon name="check" size={14} color="#ffffff" />
                          ) : (
                            <View style={styles.pendingDot} />
                          )}
                        </View>
                        <Text style={styles.stepLabel}>Xác nhận</Text>
                      </View>

                      <View style={styles.stepItem}>
                        <View
                          style={
                            statusInfo.step === 3
                              ? styles.stepCircleActiveWrap
                              : statusInfo.step > 3
                              ? styles.stepCircleCompleted
                              : styles.stepCirclePending
                          }>
                          {statusInfo.step === 3 ? (
                            <View style={styles.stepCircleActive}>
                              <Icon name="soup_kitchen" size={14} color="#ffffff" />
                            </View>
                          ) : statusInfo.step > 3 ? (
                            <Icon name="check" size={14} color="#ffffff" />
                          ) : (
                            <View style={styles.pendingDot} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            statusInfo.step === 3 && styles.stepLabelActive,
                          ]}>
                          Chế biến
                        </Text>
                      </View>

                      <View style={styles.stepItem}>
                        <View
                          style={
                            statusInfo.step >= 4
                              ? styles.stepCircleCompleted
                              : styles.stepCirclePending
                          }>
                          {statusInfo.step >= 4 ? (
                            <Icon name="check" size={14} color="#ffffff" />
                          ) : (
                            <View style={styles.pendingDot} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            statusInfo.step >= 4 && styles.stepLabelActive,
                          ]}>
                          Sẵn sàng
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status Banner */}
                  <View style={styles.etaBanner}>
                    <View style={styles.etaLeft}>
                      <Icon name="restaurant" size={18} color={ArtisanColors.primary} />
                      <Text style={styles.etaText}>{statusInfo.eta}</Text>
                    </View>
                    <Text style={styles.etaTime}>
                      {order.totalItems} món
                    </Text>
                  </View>

                  {/* Total Price Row */}
                  <View style={styles.totalRow}>
                    <Text style={styles.taxNote}>
                      {order.deliveryAddress ? `Giao đến: ${order.deliveryAddress}` : 'Nhận tại quầy'}
                    </Text>
                    <View style={styles.totalAmountWrap}>
                      <Text style={styles.totalTextLabel}>Tổng cộng:</Text>
                      <Text style={styles.totalTextValue}>
                        {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionGrid}>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/order-confirmed',
                          params: {
                            orderId: order.id,
                            orderCode: order.orderCode,
                            amount: String(order.totalAmount),
                          },
                        })
                      }
                      style={({ pressed }) => [styles.liveTrackBtn, pressed && styles.pressed]}>
                      <Icon name="location_on" size={18} color="#ffffff" />
                      <Text style={styles.liveTrackBtnText}>Theo dõi trực tiếp</Text>
                    </Pressable>

                    {order.status === OrderStatus.Pending ? (
                      <Pressable
                        onPress={() => handleCancelOrder(order)}
                        style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
                        <Icon name="close" size={18} color="#dc2626" />
                        <Text style={styles.cancelBtnText}>Hủy đơn</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() =>
                          Alert.alert(
                            'Hóa đơn điện tử',
                            `Mã đơn: #${order.orderCode || order.id}\nTổng thanh toán: ${(
                              order.totalAmount || 0
                            ).toLocaleString('vi-VN')} đ\nTrạng thái: ${statusInfo.label}`
                          )
                        }
                        style={({ pressed }) => [styles.invoiceBtn, pressed && styles.pressed]}>
                        <Icon name="receipt_long" size={18} color={ArtisanColors.onSurface} />
                        <Text style={styles.invoiceBtnText}>Xem hóa đơn</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            }

            // Completed or Cancelled Order Card
            return (
              <View key={order.id} style={styles.pastCard}>
                <View style={styles.pastTopRow}>
                  <View>
                    <View style={styles.pastIdRow}>
                      <Text style={styles.pastIdText}>
                        Đơn #{order.orderCode || order.id.slice(0, 8).toUpperCase()}
                      </Text>
                      <View
                        style={[
                          styles.completedBadge,
                          order.status === OrderStatus.Cancelled && styles.cancelledBadge,
                        ]}>
                        <Icon
                          name={order.status === OrderStatus.Cancelled ? 'cancel' : 'check_circle'}
                          size={12}
                          color={order.status === OrderStatus.Cancelled ? '#dc2626' : ArtisanColors.tertiary}
                          fill
                        />
                        <Text
                          style={[
                            styles.completedBadgeText,
                            order.status === OrderStatus.Cancelled && styles.cancelledBadgeText,
                          ]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.pastDateText}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')} •{' '}
                      {order.totalItems} món
                    </Text>
                  </View>
                  <Text style={styles.pastPriceText}>
                    {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                <View style={styles.pastBottomRow}>
                  <Text style={styles.pastBranchNote} numberOfLines={1}>
                    Chi nhánh: {order.branchCode || activeBranch?.name || 'Artisan Kitchen'}
                  </Text>

                  <Pressable
                    onPress={() => router.push('/menu')}
                    style={({ pressed }) => [styles.reorderBtn, pressed && styles.pressed]}>
                    <Icon name="restaurant_menu" size={16} color={ArtisanColors.primary} />
                    <Text style={styles.reorderBtnText}>Đặt lại</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : !isLoading ? (
          <View style={styles.emptyWrap}>
            <Icon name="receipt_long" size={48} color={ArtisanColors.outlineVariant} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'cancelled'
                ? 'Không có đơn hàng đã hủy'
                : activeTab === 'completed'
                ? 'Chưa có đơn hàng hoàn tất'
                : activeTab === 'active'
                ? 'Không có đơn hàng nào đang xử lý'
                : 'Chưa có đơn hàng nào'}
            </Text>
            <Text style={styles.emptySub}>
              Mọi trải nghiệm ẩm thực của bạn tại Artisan Kitchen đều được trân trọng và phục vụ chu đáo!
            </Text>
            <Pressable
              onPress={() => router.push('/menu')}
              style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>Khám phá thực đơn</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Persistent Bottom Tabs */}
      <BottomNavigation currentTab="orders" />
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
  branchHeaderRow: {
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
  branchSubtitle: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    lineHeight: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    lineHeight: 22,
  },
  notifBtn: {
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
    gap: 16,
  },
  tabTrack: {
    gap: 8,
    paddingVertical: 2,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabChipActive: {
    backgroundColor: '#2A201C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  tabChipInactive: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: ArtisanColors.surfaceContainerHigh,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: '#ffffff',
  },
  tabChipTextInactive: {
    color: ArtisanColors.onSurface,
  },
  tabCountBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ArtisanColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountBadgeActive: {
    backgroundColor: ArtisanColors.primary,
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  tabCountTextActive: {
    color: '#ffffff',
  },
  bentoCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ArtisanColors.surfaceContainer,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  inKitchenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ArtisanColors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.primary,
  },
  inKitchenText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  orderTimeText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 4,
  },
  branchBox: {
    alignItems: 'flex-end',
  },
  branchLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 0.5,
  },
  branchNameBold: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
    marginTop: 2,
  },
  timelineSection: {
    paddingVertical: 18,
    position: 'relative',
  },
  progressLineBg: {
    position: 'absolute',
    top: 29,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: ArtisanColors.surfaceContainer,
    borderRadius: 1.5,
  },
  progressLineActive: {
    position: 'absolute',
    top: 29,
    left: 20,
    width: '50%',
    height: 3,
    backgroundColor: ArtisanColors.primary,
    borderRadius: 1.5,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    width: 54,
  },
  stepCircleCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActiveWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCirclePulseRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(216, 67, 21, 0.25)',
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  stepCirclePending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.outline,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: ArtisanColors.primary,
    fontWeight: '700',
  },
  stepLabelPending: {
    color: ArtisanColors.secondary,
    fontWeight: '400',
  },
  etaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 14,
  },
  etaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  etaText: {
    fontSize: 12,
    color: ArtisanColors.onSurface,
    fontWeight: '500',
  },
  etaTime: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  itemsList: {
    gap: 10,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ArtisanColors.surfaceContainerLow,
    padding: 8,
    borderRadius: 10,
  },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  itemDetailCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  itemSub: {
    fontSize: 11,
    color: ArtisanColors.secondary,
    marginTop: 1,
  },
  itemPriceCol: {
    alignItems: 'flex-end',
  },
  itemQty: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: ArtisanColors.surfaceContainer,
    marginBottom: 12,
  },
  taxNote: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  totalAmountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalTextLabel: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  totalTextValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  liveTrackBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  liveTrackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  invoiceBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: ArtisanColors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: ArtisanColors.outlineVariant,
  },
  invoiceBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  pastSection: {
    gap: 12,
  },
  pastSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  pastSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  filterDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  filterDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.primary,
  },
  pastList: {
    gap: 12,
  },
  pastCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    gap: 10,
  },
  pastTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pastIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pastIdText: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 106, 33, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ArtisanColors.tertiary,
  },
  pastDateText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 3,
  },
  pastPriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  pastBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ArtisanColors.surfaceContainerLow,
  },
  pastMiniPreviews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  miniThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: ArtisanColors.surfaceContainerLowest,
  },
  miniDishCountText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    flex: 1,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ArtisanColors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reorderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  emptySub: {
    fontSize: 13,
    color: ArtisanColors.secondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  cancelledBadgeText: {
    color: '#dc2626',
  },
  pastBranchNote: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    flex: 1,
  },
  exploreBtn: {
    marginTop: 12,
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

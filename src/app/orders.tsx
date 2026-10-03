import { router } from 'expo-router';
import React from 'react';
import {
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
import { CURRENT_BRANCH, MOCK_ORDERS } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';

export default function OrdersScreen() {
  const activeOrder = MOCK_ORDERS[0];
  const pastOrders = MOCK_ORDERS.slice(1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <TopHeader
        title={CURRENT_BRANCH.name}
        showBranch
        showNotifications
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.subTitle}>TRẢI NGHIỆM ẨM THỰC</Text>
          <Text style={styles.pageTitle}>Lịch sử đơn hàng</Text>
        </View>

        {/* Active Order Card */}
        {activeOrder && (
          <View style={styles.activeOrderCard}>
            <View style={styles.activeHeader}>
              <View style={styles.activeHeaderLeft}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeStatusText}>{activeOrder.status}</Text>
              </View>
              <Text style={styles.orderId}>#{activeOrder.id}</Text>
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.orderBranchRow}>
              <Icon name="storefront" size={16} color={ArtisanColors.primary} fill />
              <Text style={styles.orderBranchText}>{activeOrder.branch}</Text>
              <Text style={styles.orderTimeText}>• {activeOrder.date}</Text>
            </View>

            <View style={styles.orderItemsList}>
              {activeOrder.items.map((it, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemNameText}>
                    {it.qty}x {it.name}
                  </Text>
                  <Text style={styles.itemPriceText}>{it.price}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.activeFooter}>
              <View>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.activeTotalText}>{activeOrder.total}</Text>
              </View>
              <Pressable style={styles.trackBtn}>
                <Text style={styles.trackBtnText}>Theo dõi tiến độ</Text>
                <Icon name="arrow_forward" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Past Orders Section */}
        <View style={styles.pastSection}>
          <Text style={styles.sectionHeaderTitle}>Đơn hàng đã hoàn tất</Text>

          {pastOrders.map((ord) => (
            <View key={ord.id} style={styles.pastCard}>
              <View style={styles.pastCardTop}>
                <View>
                  <Text style={styles.pastOrderId}>#{ord.id}</Text>
                  <Text style={styles.pastDateText}>{ord.date} • {ord.branch}</Text>
                </View>
                <View style={styles.completedBadge}>
                  <Icon name="check_circle" size={12} color={ArtisanColors.tertiary} fill />
                  <Text style={styles.completedText}>Hoàn tất</Text>
                </View>
              </View>

              <View style={styles.pastItems}>
                {ord.items.map((it, idx) => (
                  <Text key={idx} style={styles.pastItemText}>
                    • {it.qty}x {it.name} ({it.price})
                  </Text>
                ))}
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.pastCardBottom}>
                <Text style={styles.pastTotal}>
                  Tổng cộng: <Text style={styles.pastTotalVal}>{ord.total}</Text>
                </Text>
                <Pressable
                  onPress={() => router.push('/cart')}
                  style={({ pressed }) => [styles.reorderBtn, pressed && styles.pressed]}>
                  <Icon name="replay" size={16} color={ArtisanColors.primary} />
                  <Text style={styles.reorderText}>Đặt lại món này</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab="orders" />
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
  titleSection: {
    paddingVertical: 4,
    gap: 2,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.4,
  },
  activeOrderCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: ArtisanColors.primary,
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ArtisanColors.primary,
  },
  activeStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.secondary,
  },
  orderDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(143, 112, 104, 0.2)',
  },
  orderBranchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderBranchText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  orderTimeText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  orderItemsList: {
    gap: 6,
    paddingVertical: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemNameText: {
    fontSize: 13,
    color: ArtisanColors.onSurface,
    fontWeight: '500',
  },
  itemPriceText: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  activeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: ArtisanColors.secondary,
  },
  activeTotalText: {
    fontSize: 17,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: ArtisanColors.primary,
  },
  trackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  pastSection: {
    gap: 12,
    marginTop: 6,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  pastCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 10,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pastCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  pastOrderId: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  pastDateText: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 105, 71, 0.1)',
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.tertiary,
  },
  pastItems: {
    gap: 4,
  },
  pastItemText: {
    fontSize: 12,
    color: ArtisanColors.onSurfaceVariant,
    lineHeight: 16,
  },
  pastCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  pastTotal: {
    fontSize: 13,
    color: ArtisanColors.secondary,
  },
  pastTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: ArtisanColors.surfaceContainerLow,
  },
  reorderText: {
    fontSize: 12,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

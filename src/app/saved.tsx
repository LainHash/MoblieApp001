import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { FloatingCartBar } from '@/components/floating-cart-bar';
import { Icon } from '@/components/icon';
import { TopHeader } from '@/components/top-header';
import { CURRENT_BRANCH, DISHES } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';

export default function SavedScreen() {
  const [savedDishes, setSavedDishes] = useState(DISHES.slice(0, 4));

  const removeSaved = (id: string) => {
    setSavedDishes((prev) => prev.filter((d) => d.id !== id));
  };

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
          <Text style={styles.subTitle}>DANH SÁCH YÊU THÍCH</Text>
          <Text style={styles.pageTitle}>
            Món đã lưu <Text style={styles.countText}>({savedDishes.length} món)</Text>
          </Text>
        </View>

        {savedDishes.length === 0 ? (
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
          <View style={styles.list}>
            {savedDishes.map((dish) => (
              <Pressable
                key={dish.id}
                onPress={() => router.push('/food-detail')}
                style={({ pressed }) => [styles.itemCard, pressed && styles.pressed]}>
                <View style={styles.imageWrap}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                  />
                  <Pressable
                    accessibilityLabel="Bỏ lưu yêu thích"
                    onPress={(e) => {
                      e.stopPropagation();
                      removeSaved(dish.id);
                    }}
                    style={styles.heartBtn}>
                    <Icon name="favorite" size={17} color={ArtisanColors.primary} fill />
                  </Pressable>
                </View>

                <View style={styles.itemInfo}>
                  <View>
                    <Text style={styles.dishName} numberOfLines={1}>
                      {dish.name}
                    </Text>
                    <Text style={styles.dishSub} numberOfLines={1}>
                      {dish.subtitle}
                    </Text>
                    <View style={styles.ratingRow}>
                      <Icon name="star" size={14} color={ArtisanColors.primary} fill />
                      <Text style={styles.ratingText}>{dish.rating}</Text>
                    </View>
                  </View>

                  <View style={styles.itemBottom}>
                    <Text style={styles.price}>{dish.priceFormatted}</Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/cart');
                      }}
                      style={({ pressed }) => [styles.addCartBtn, pressed && styles.pressed]}>
                      <Icon name="shopping_bag" size={15} color="#ffffff" />
                      <Text style={styles.addCartText}>Thêm vào giỏ</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Persistent Cart Drawer */}
      <FloatingCartBar itemCount={2} subtotal="415.000 đ" bottomOffset={70} />

      {/* Bottom Navigation */}
      <BottomNavigation currentTab="saved" />
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
  titleSection: {
    paddingVertical: 6,
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
  countText: {
    fontSize: 17,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  list: {
    marginTop: 14,
    gap: 12,
  },
  itemCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  imageWrap: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: ArtisanColors.surfaceContainer,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 14,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  dishSub: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: ArtisanColors.primary,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: ArtisanColors.primary,
  },
  addCartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    maxWidth: 260,
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
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

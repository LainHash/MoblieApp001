import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';

interface FloatingCartBarProps {
  itemCount?: number;
  subtotal?: string;
  bottomOffset?: number;
}

export function FloatingCartBar({
  itemCount = 2,
  subtotal = '415.000 đ',
  bottomOffset = 76,
}: FloatingCartBarProps) {
  if (itemCount <= 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: bottomOffset },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Xem giỏ hàng, ${itemCount} món, tổng cộng ${subtotal}`}
        onPress={() => router.push('/cart')}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        <View style={styles.left}>
          <View style={styles.iconCircle}>
            <Icon name="shopping_bag" size={18} color={ArtisanColors.primaryFixed} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          </View>
          <View style={styles.textGroup}>
            <Text style={styles.itemTitle}>{itemCount} món trong giỏ</Text>
            <Text style={styles.subtotalText}>{subtotal} tạm tính</Text>
          </View>
        </View>

        <View style={styles.viewCartButton}>
          <Text style={styles.viewCartText}>Xem giỏ</Text>
          <Icon name="shopping_cart" size={16} color="#ffffff" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 45,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        maxWidth: 520,
        marginHorizontal: 'auto' as any,
      },
    }),
  },
  pill: {
    height: 54,
    backgroundColor: ArtisanColors.darkRoast,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 8,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  textGroup: {
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  subtotalText: {
    fontSize: 11,
    color: ArtisanColors.secondaryFixedDim,
    fontWeight: '500',
  },
  viewCartButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: ArtisanColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default FloatingCartBar;

import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  showBranch?: boolean;
  showNotifications?: boolean;
  showCart?: boolean;
  cartCount?: number;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
}

export function TopHeader({
  title = 'Artisan Kitchen',
  showBack = false,
  showBranch = true,
  showNotifications = true,
  showCart = false,
  cartCount = 0,
  rightAction,
  onBackPress,
}: TopHeaderProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Quay lại"
            onPress={handleBack}
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
            <Icon name="arrow_back" size={20} color={ArtisanColors.onSurface} />
          </Pressable>
        ) : showBranch ? (
          <View style={styles.branchRow}>
            <Icon name="storefront" size={22} color={ArtisanColors.primary} fill />
            <Text style={styles.branchTitle}>{title}</Text>
          </View>
        ) : (
          <Text style={styles.screenTitle}>{title}</Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {showCart && (
              <Pressable
                accessibilityLabel="Giỏ hàng"
                onPress={() => router.push('/cart')}
                style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
                <Icon name="shopping_bag" size={20} color={ArtisanColors.onSurface} />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </Pressable>
            )}

            {showNotifications && (
              <Pressable
                accessibilityLabel="Thông báo"
                style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
                <Icon name="notifications" size={22} color={ArtisanColors.onSurfaceVariant} />
                <View style={styles.notificationDot} />
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: ArtisanColors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(143, 112, 104, 0.15)',
    zIndex: 40,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  branchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
    letterSpacing: -0.3,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    position: 'relative',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ArtisanColors.primary,
    borderWidth: 1.5,
    borderColor: ArtisanColors.surface,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default TopHeader;

import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ArtisanColors } from '@/constants/theme';

export type TabKey = 'home' | 'menu' | 'saved' | 'orders' | 'profile';

interface BottomNavigationProps {
  currentTab?: TabKey;
}

export function BottomNavigation({ currentTab = 'home' }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  const tabs: { key: TabKey; label: string; icon: string; route: string }[] = [
    { key: 'home', label: 'Trang chủ', icon: 'home', route: '/' },
    { key: 'menu', label: 'Thực đơn', icon: 'restaurant_menu', route: '/menu' },
    { key: 'saved', label: 'Đã lưu', icon: 'favorite', route: '/saved' },
    { key: 'orders', label: 'Đơn hàng', icon: 'receipt_long', route: '/orders' },
    { key: 'profile', label: 'Hồ sơ', icon: 'person', route: '/profile' },
  ];

  const handleTabPress = (route: string, key: TabKey) => {
    if (key === currentTab) return;
    router.replace(route as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === currentTab;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => handleTabPress(tab.route, tab.key)}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.tabItemPressed,
              ]}>
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? ArtisanColors.primary : ArtisanColors.secondary}
                fill={isActive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? ArtisanColors.primary : ArtisanColors.secondary },
                  isActive && styles.tabLabelActive,
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ArtisanColors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(143, 112, 104, 0.2)',
    zIndex: 50,
    ...Platform.select({
      web: {
        maxWidth: 520,
        marginHorizontal: 'auto' as any,
      },
    }),
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    gap: 3,
  },
  tabItemPressed: {
    transform: [{ scale: 0.92 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});

export default BottomNavigation;

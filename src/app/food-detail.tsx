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
import { CURRENT_BRANCH, DISHES } from '@/constants/mock-data';
import { ArtisanColors } from '@/constants/theme';

export default function FoodDetailScreen() {
  const insets = useSafeAreaInsets();
  const dish = DISHES[0]; // Burger Bò Wagyu Nấm Truffle

  const [isFavorite, setIsFavorite] = useState(true);
  const [selectedBun, setSelectedBun] = useState(dish.bunOptions?.[0]?.label || '');
  const [selectedDoneness, setSelectedDoneness] = useState(dish.donenessOptions?.[0]?.label || '');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([
    dish.addOns?.[0]?.name || '',
  ]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const calculateTotal = () => {
    let price = dish.price;
    const bun = dish.bunOptions?.find((b) => b.label === selectedBun);
    if (bun) price += bun.extra;

    dish.addOns?.forEach((a) => {
      if (selectedAddOns.includes(a.name)) {
        price += a.price;
      }
    });

    const total = price * quantity;
    return total.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <View style={styles.container}>
      {/* Top Floating App Bar */}
      <SafeAreaView style={styles.topBarSafe} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Quay lại"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.topIconBtn, pressed && styles.pressed]}>
            <Icon name="arrow_back" size={20} color={ArtisanColors.onSurface} />
          </Pressable>

          <View style={styles.topBarRight}>
            <Pressable
              accessibilityLabel="Yêu thích"
              onPress={() => setIsFavorite(!isFavorite)}
              style={({ pressed }) => [styles.topIconBtn, pressed && styles.pressed]}>
              <Icon
                name="favorite"
                size={20}
                color={isFavorite ? ArtisanColors.primary : ArtisanColors.secondary}
                fill={isFavorite}
              />
            </Pressable>
            <Pressable
              accessibilityLabel="Chia sẻ món ăn"
              style={({ pressed }) => [styles.topIconBtn, pressed && styles.pressed]}>
              <Icon name="share" size={20} color={ArtisanColors.onSurface} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero Image Section */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: dish.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.heroVignette} />

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.activeDot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Header & Price */}
          <View style={styles.headerInfo}>
            <View style={styles.headerTop}>
              <Text style={styles.categoryBadge}>MÓN ĐẶC TRƯNG • NƯỚNG LÒ CỦI</Text>
              <Text style={styles.priceHero}>{dish.priceFormatted}</Text>
            </View>
            <Text style={styles.dishTitle}>{dish.name}</Text>
          </View>

          {/* Availability Status Tile */}
          <View style={styles.statusTile}>
            <Icon name="storefront" size={18} color={ArtisanColors.primary} fill />
            <Text style={styles.statusTileText}>
              Có sẵn tại {CURRENT_BRANCH.name} • Chuẩn bị ~15-20 phút
            </Text>
          </View>

          {/* Badges Track */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesTrack}>
            <View style={styles.infoBadge}>
              <Icon name="star" size={16} color={ArtisanColors.primary} fill />
              <Text style={styles.infoBadgeText}>{dish.rating}</Text>
            </View>
            {dish.dietary?.map((diet, idx) => (
              <View key={idx} style={styles.infoBadge}>
                <Icon
                  name={idx === 0 ? 'verified' : 'check_circle'}
                  size={16}
                  color={idx === 0 ? ArtisanColors.outline : ArtisanColors.tertiary}
                  fill
                />
                <Text
                  style={[
                    styles.infoBadgeText,
                    idx !== 0 && { color: ArtisanColors.tertiary },
                  ]}>
                  {diet}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Culinary Composition / Description */}
          <View style={styles.descCard}>
            <Text style={styles.descTitle}>THÀNH PHẦN NGHỆ THUẬT ẨM THỰC</Text>
            <Text style={styles.descText}>{dish.description}</Text>
          </View>

          {/* Section 1: Bun Choice */}
          {dish.bunOptions && dish.bunOptions.length > 0 && (
            <View style={styles.customSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>Chọn loại vỏ bánh</Text>
                <Text style={styles.sectionRequired}>Bắt buộc • Chọn 1</Text>
              </View>

              {dish.bunOptions.map((opt) => {
                const isSelected = selectedBun === opt.label;
                return (
                  <Pressable
                    key={opt.label}
                    onPress={() => setSelectedBun(opt.label)}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}>
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                      <Text style={styles.optionSub}>{opt.sub}</Text>
                    </View>
                    {opt.extra > 0 && (
                      <Text style={styles.extraPrice}>
                        +{opt.extra.toLocaleString('vi-VN')} đ
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Section 2: Doneness */}
          {dish.donenessOptions && dish.donenessOptions.length > 0 && (
            <View style={styles.customSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>Độ chín của thịt</Text>
                <Text style={styles.sectionRequired}>Tùy chọn • Chọn 1</Text>
              </View>

              {dish.donenessOptions.map((opt) => {
                const isSelected = selectedDoneness === opt.label;
                return (
                  <Pressable
                    key={opt.label}
                    onPress={() => setSelectedDoneness(opt.label)}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}>
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                      <Text style={styles.optionSub}>{opt.note}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Section 3: Artisan Add-ons */}
          {dish.addOns && dish.addOns.length > 0 && (
            <View style={styles.customSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeaderTitle}>Món ăn kèm & Topping thêm</Text>
                <Text style={styles.sectionRequired}>Tùy chọn thêm</Text>
              </View>

              {dish.addOns.map((opt) => {
                const isSelected = selectedAddOns.includes(opt.name);
                return (
                  <Pressable
                    key={opt.name}
                    onPress={() => toggleAddOn(opt.name)}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}>
                    <View style={[styles.checkOuter, isSelected && styles.checkOuterSelected]}>
                      {isSelected && <Icon name="check_circle" size={16} color="#ffffff" fill />}
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionLabel}>{opt.name}</Text>
                    </View>
                    <Text style={styles.extraPrice}>{opt.priceFormatted}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Chef Instructions */}
          <View style={styles.customSection}>
            <Text style={styles.sectionHeaderTitle}>Ghi chú cho đầu bếp</Text>
            <TextInput
              style={styles.instructionInput}
              placeholder="Ví dụ: Để nước sốt riêng, ít cay, không hành tây sống, dị ứng thực phẩm..."
              placeholderTextColor={ArtisanColors.outline}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* Docked Bottom CTA Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.stepperWrap}>
          <Pressable
            accessibilityLabel="Giảm số lượng"
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.stepperBtn}>
            <Icon name="remove" size={18} color={ArtisanColors.onSurface} />
          </Pressable>
          <Text style={styles.stepperText}>{quantity}</Text>
          <Pressable
            accessibilityLabel="Tăng số lượng"
            onPress={() => setQuantity(quantity + 1)}
            style={styles.stepperBtn}>
            <Icon name="add" size={18} color={ArtisanColors.onSurface} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/cart')}
          style={({ pressed }) => [styles.addToCartBtn, pressed && styles.pressed]}>
          <Text style={styles.addToCartText}>Thêm vào giỏ • {calculateTotal()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ArtisanColors.background,
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
  topBarSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(251, 249, 246, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: ArtisanColors.surfaceContainerHigh,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: ArtisanColors.primary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  contentBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  headerInfo: {
    gap: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: ArtisanColors.primary,
    letterSpacing: 0.8,
  },
  priceHero: {
    fontSize: 24,
    fontWeight: '800',
    color: ArtisanColors.primary,
    letterSpacing: -0.5,
  },
  dishTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  statusTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  statusTileText: {
    fontSize: 13,
    fontWeight: '600',
    color: ArtisanColors.onSurfaceVariant,
  },
  badgesTrack: {
    gap: 8,
    paddingVertical: 2,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  descCard: {
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  descTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ArtisanColors.secondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: ArtisanColors.onSurfaceVariant,
  },
  customSection: {
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ArtisanColors.onSurface,
  },
  sectionRequired: {
    fontSize: 12,
    color: ArtisanColors.secondary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
    gap: 12,
  },
  optionRowSelected: {
    borderColor: ArtisanColors.primary,
    backgroundColor: 'rgba(173, 44, 0, 0.03)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ArtisanColors.primary,
  },
  checkOuter: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: ArtisanColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOuterSelected: {
    borderColor: ArtisanColors.primary,
    backgroundColor: ArtisanColors.primary,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ArtisanColors.onSurface,
  },
  optionSub: {
    fontSize: 12,
    color: ArtisanColors.secondary,
    marginTop: 2,
  },
  extraPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ArtisanColors.primary,
  },
  instructionInput: {
    minHeight: 80,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.5)',
    padding: 12,
    fontSize: 14,
    color: ArtisanColors.onSurface,
    textAlignVertical: 'top',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 40,
    shadowColor: '#2b2320',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    ...Platform.select({
      web: {
        maxWidth: 520,
        marginHorizontal: 'auto' as any,
      },
    }),
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ArtisanColors.surfaceContainerLow,
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(227, 190, 181, 0.4)',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ArtisanColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    width: 32,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: ArtisanColors.onSurface,
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: ArtisanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ArtisanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});

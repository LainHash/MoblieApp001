import React from 'react';
import { Platform, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  fill?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Icon({ name, size = 24, color = '#1b1c1a', fill = false, style }: IconProps) {
  const isWeb = Platform.OS === 'web';

  const fontStyle: TextStyle = isWeb
    ? ({
        fontFamily: "'Material Symbols Outlined', sans-serif",
        fontSize: size,
        color,
        fontVariationSettings: fill ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
        userSelect: 'none',
        display: 'inline-block',
        lineHeight: size,
        textAlign: 'center',
        verticalAlign: 'middle',
      } as any)
    : {
        fontFamily: 'MaterialSymbols_400Regular',
        fontSize: size,
        color,
        lineHeight: size + 2,
        textAlign: 'center',
      };

  return (
    <Text
      accessibilityRole="image"
      style={[styles.base, fontStyle, style]}
      suppressHighlighting>
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Icon;

import React from 'react';
import { Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function InfoCard({
  label,
  value,
  tone = 'normal',
}: {
  label: string;
  value?: string | null;
  tone?: 'normal' | 'important';
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        gap: Spacing.one,
        padding: Spacing.three,
        borderRadius: 8,
        borderCurve: 'continuous',
        backgroundColor: tone === 'important' ? theme.backgroundSelected : theme.backgroundElement,
        borderWidth: 1,
        borderColor: theme.border,
      }}>
      <Text
        selectable
        style={{
          color: theme.textSecondary,
          fontSize: 15,
          lineHeight: 20,
          fontWeight: '700',
        }}>
        {label}
      </Text>
      <Text
        selectable
        style={{
          color: theme.text,
          fontSize: 22,
          lineHeight: 30,
          fontWeight: '700',
        }}>
        {value || 'Please check manually'}
      </Text>
    </View>
  );
}

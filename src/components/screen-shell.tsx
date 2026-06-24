import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ScreenShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.four,
        paddingBottom: insets.bottom + Spacing.five,
      }}>
      <View
        style={{
          width: '100%',
          maxWidth: MaxContentWidth,
          alignSelf: 'center',
          gap: Spacing.three,
        }}>
        {children}
      </View>
    </ScrollView>
  );
}

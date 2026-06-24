import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { languageOptions } from '@/constants/languages';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LanguageCode } from '@/types/domain';

export function LanguageSelector({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ gap: Spacing.two }}>
      <Text
        selectable
        style={{
          color: theme.text,
          fontSize: 19,
          lineHeight: 26,
          fontWeight: '700',
        }}>
        Listening language
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        {languageOptions.map((language) => {
          const selected = language.code === value;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={language.code}
              onPress={() => onChange(language.code)}
              style={({ pressed }) => ({
                minHeight: 52,
                minWidth: 120,
                flexGrow: 1,
                borderRadius: 8,
                borderCurve: 'continuous',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Spacing.three,
                backgroundColor: selected ? theme.accent : theme.backgroundElement,
                borderWidth: selected ? 0 : 1,
                borderColor: theme.border,
                opacity: pressed ? 0.72 : 1,
              })}>
              <Text
                style={{
                  color: selected ? theme.accentText : theme.text,
                  fontSize: 18,
                  lineHeight: 24,
                  fontWeight: '700',
                }}>
                {language.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

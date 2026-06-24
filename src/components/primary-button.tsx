import React from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type PrimaryButtonProps = PressableProps & {
  children: string;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export const PrimaryButton = React.forwardRef<React.ComponentRef<typeof Pressable>, PrimaryButtonProps>(
  function PrimaryButton(
    {
      children,
      variant = 'primary',
      disabled = false,
      style,
      ...pressableProps
    },
    ref
  ) {
    const theme = useTheme();
    const isPrimary = variant === 'primary';
    const isDanger = variant === 'danger';

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        disabled={disabled}
        {...pressableProps}
        style={({ pressed }) => ({
          minHeight: 60,
          borderRadius: 8,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: Spacing.four,
          paddingVertical: Spacing.three,
          backgroundColor: disabled
            ? theme.backgroundSelected
            : isPrimary
              ? theme.accent
              : isDanger
                ? theme.danger
                : theme.backgroundElement,
          borderWidth: isPrimary || isDanger ? 0 : 1,
          borderColor: theme.border,
          opacity: pressed ? 0.72 : 1,
          ...(typeof style === 'function' ? style({ pressed, hovered: false }) : style),
        })}>
        <Text
          style={{
            color: isPrimary || isDanger ? theme.accentText : theme.text,
            fontSize: 20,
            lineHeight: 26,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {children}
        </Text>
      </Pressable>
    );
  }
);

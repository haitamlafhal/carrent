import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    style,
    textStyle,
}) => {
    const getButtonStyle = (): ViewStyle[] => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: borderRadius.md,
        };

        const sizeStyles: Record<string, ViewStyle> = {
            sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
            md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
            lg: { paddingVertical: spacing.base, paddingHorizontal: spacing.xl },
        };

        const variantStyles: Record<string, ViewStyle> = {
            primary: { backgroundColor: colors.primary[500] },
            secondary: { backgroundColor: colors.secondary[500] },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: colors.primary[500],
            },
            ghost: { backgroundColor: 'transparent' },
        };

        const styles: ViewStyle[] = [
            baseStyle,
            sizeStyles[size],
            variantStyles[variant],
        ];

        if (fullWidth) {
            styles.push({ width: '100%' });
        }

        if (disabled) {
            styles.push({ opacity: 0.5 });
        }

        return styles;
    };

    const getTextStyle = (): TextStyle => {
        const sizeStyles: Record<string, TextStyle> = {
            sm: { fontSize: typography.fontSize.sm },
            md: { fontSize: typography.fontSize.base },
            lg: { fontSize: typography.fontSize.md },
        };

        const variantStyles: Record<string, TextStyle> = {
            primary: { color: colors.text.inverse, fontWeight: '600' },
            secondary: { color: colors.text.primary, fontWeight: '600' },
            outline: { color: colors.primary[500], fontWeight: '600' },
            ghost: { color: colors.primary[500], fontWeight: '500' },
        };

        return {
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[...getButtonStyle(), style]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.text.inverse : colors.primary[500]}
                    size="small"
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[getTextStyle(), icon && { marginLeft: spacing.sm }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;

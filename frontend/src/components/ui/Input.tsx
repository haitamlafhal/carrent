import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputError,
                    props.editable === false && styles.inputDisabled,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        rightIcon && styles.inputWithRightIcon,
                        style,
                    ]}
                    placeholderTextColor={colors.neutral[400]}
                    {...props}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.base,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
    },
    inputError: {
        borderColor: colors.error.main,
    },
    inputDisabled: {
        backgroundColor: colors.neutral[100],
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.base,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    inputWithLeftIcon: {
        paddingLeft: spacing.xs,
    },
    inputWithRightIcon: {
        paddingRight: spacing.xs,
    },
    iconLeft: {
        paddingLeft: spacing.md,
    },
    iconRight: {
        paddingRight: spacing.md,
    },
    errorText: {
        fontSize: typography.fontSize.sm,
        color: colors.error.main,
        marginTop: spacing.xs,
    },
});

export default Input;

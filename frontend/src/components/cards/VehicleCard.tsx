import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../theme';
import { Vehicle } from '../../types';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: () => void;
    compact?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, compact = false }) => {
    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            economy: '🚗',
            compact: '🚙',
            suv: '🚐',
            luxury: '🏎️',
            van: '🚐',
            sports: '🏎️',
        };
        return icons[category] || '🚗';
    };

    const getTransmissionLabel = (transmission: string) => {
        return transmission === 'automatic' ? 'Auto' : 'Manual';
    };

    const getFuelIcon = (fuel: string) => {
        const icons: Record<string, string> = {
            petrol: '⛽',
            diesel: '⛽',
            electric: '⚡',
            hybrid: '🔋',
        };
        return icons[fuel] || '⛽';
    };

    if (compact) {
        return (
            <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.9}>
                <View style={styles.compactImageContainer}>
                    {vehicle.images && vehicle.images.length > 0 ? (
                        <Image source={{ uri: vehicle.images[0] }} style={styles.compactImage} />
                    ) : (
                        <View style={styles.compactPlaceholder}>
                            <Text style={styles.compactPlaceholderText}>{getCategoryIcon(vehicle.category)}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.compactContent}>
                    <Text style={styles.compactTitle} numberOfLines={1}>
                        {vehicle.make} {vehicle.model}
                    </Text>
                    <Text style={styles.compactPrice}>${vehicle.dailyRate}/day</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                {vehicle.images && vehicle.images.length > 0 ? (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {vehicle.images.slice(0, 3).map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={styles.image} />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>{getCategoryIcon(vehicle.category)}</Text>
                    </View>
                )}
                {!vehicle.isAvailable && (
                    <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableText}>Unavailable</Text>
                    </View>
                )}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{vehicle.category.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>
                            {vehicle.make} {vehicle.model}
                        </Text>
                        <Text style={styles.year}>{vehicle.year}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${vehicle.dailyRate}</Text>
                        <Text style={styles.priceLabel}>/day</Text>
                    </View>
                </View>
                <View style={styles.specs}>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>⚙️</Text>
                        <Text style={styles.specText}>{getTransmissionLabel(vehicle.transmission)}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>{getFuelIcon(vehicle.fuelType)}</Text>
                        <Text style={styles.specText}>{vehicle.fuelType}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>👥</Text>
                        <Text style={styles.specText}>{vehicle.seats} seats</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>🚪</Text>
                        <Text style={styles.specText}>{vehicle.doors} doors</Text>
                    </View>
                </View>
                {vehicle.features && vehicle.features.length > 0 && (
                    <View style={styles.features}>
                        {vehicle.features.slice(0, 4).map((feature, index) => (
                            <View key={index} style={styles.featureBadge}>
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                        {vehicle.features.length > 4 && (
                            <View style={styles.featureBadge}>
                                <Text style={styles.featureText}>+{vehicle.features.length - 4}</Text>
                            </View>
                        )}
                    </View>
                )}
                {vehicle.deliveryAvailable && (
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryIcon}>🚚</Text>
                        <Text style={styles.deliveryText}>
                            Delivery available (+${vehicle.deliveryFee})
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.base,
        overflow: 'hidden',
        ...shadows.md,
    },
    imageContainer: {
        height: 180,
        position: 'relative',
    },
    image: {
        width: 350,
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 64,
    },
    unavailableBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
    },
    categoryBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    categoryText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.xs,
        fontWeight: '700',
    },
    content: {
        padding: spacing.base,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
    },
    year: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.primary[500],
    },
    priceLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginLeft: 2,
    },
    specs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.md,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.base,
        marginBottom: spacing.xs,
    },
    specIcon: {
        fontSize: typography.fontSize.sm,
        marginRight: spacing.xs,
    },
    specText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textTransform: 'capitalize',
    },
    features: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.md,
    },
    featureBadge: {
        backgroundColor: colors.neutral[100],
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    featureText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success.light,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    deliveryIcon: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.sm,
    },
    deliveryText: {
        fontSize: typography.fontSize.sm,
        color: colors.success.dark,
        fontWeight: '500',
    },
    // Compact styles
    compactContainer: {
        width: 160,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
        overflow: 'hidden',
        ...shadows.sm,
    },
    compactImageContainer: {
        height: 100,
    },
    compactImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    compactPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactPlaceholderText: {
        fontSize: 32,
    },
    compactContent: {
        padding: spacing.sm,
    },
    compactTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    compactPrice: {
        fontSize: typography.fontSize.sm,
        fontWeight: '700',
        color: colors.primary[500],
    },
});

export default VehicleCard;

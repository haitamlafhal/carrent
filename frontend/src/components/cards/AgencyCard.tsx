import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../theme';
import { Agency } from '../../types';

interface AgencyCardProps {
    agency: Agency;
    onPress: () => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({ agency, onPress }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Text key={i} style={styles.starFull}>
                        ★
                    </Text>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Text key={i} style={styles.starHalf}>
                        ★
                    </Text>
                );
            } else {
                stars.push(
                    <Text key={i} style={styles.starEmpty}>
                        ★
                    </Text>
                );
            }
        }
        return stars;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                {agency.coverPhotoUrl ? (
                    <Image source={{ uri: agency.coverPhotoUrl }} style={styles.coverImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>🚗</Text>
                    </View>
                )}
                {agency.distance && (
                    <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>{agency.distance.toFixed(1)} km</Text>
                    </View>
                )}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    {agency.logoUrl ? (
                        <Image source={{ uri: agency.logoUrl }} style={styles.logo} />
                    ) : (
                        <View style={styles.logoPlaceholder}>
                            <Text style={styles.logoText}>{agency.name.charAt(0)}</Text>
                        </View>
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={styles.name} numberOfLines={1}>
                            {agency.name}
                        </Text>
                        <View style={styles.ratingContainer}>
                            {renderStars(agency.averageRating || 0)}
                            <Text style={styles.ratingText}>
                                {(agency.averageRating || 0).toFixed(1)} ({agency.totalReviews || 0})
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <Text style={styles.infoText} numberOfLines={1}>
                            {agency.address.city}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoIcon}>🚙</Text>
                        <Text style={styles.infoText}>
                            {agency.availableCarsCount || 0} cars available
                        </Text>
                    </View>
                    {agency.deliveryAvailable && (
                        <View style={styles.deliveryBadge}>
                            <Text style={styles.deliveryText}>🚚 Delivery</Text>
                        </View>
                    )}
                </View>
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
        height: 140,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 48,
    },
    distanceBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    distanceText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
    },
    content: {
        padding: spacing.base,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.xl,
        fontWeight: 'bold',
    },
    headerInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starFull: {
        color: colors.secondary[500],
        fontSize: typography.fontSize.sm,
    },
    starHalf: {
        color: colors.secondary[300],
        fontSize: typography.fontSize.sm,
    },
    starEmpty: {
        color: colors.neutral[300],
        fontSize: typography.fontSize.sm,
    },
    ratingText: {
        marginLeft: spacing.xs,
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.base,
    },
    infoIcon: {
        fontSize: typography.fontSize.sm,
        marginRight: spacing.xs,
    },
    infoText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    deliveryBadge: {
        backgroundColor: colors.success.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    deliveryText: {
        fontSize: typography.fontSize.xs,
        color: colors.success.dark,
        fontWeight: '500',
    },
});

export default AgencyCard;

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { VehicleCard, Button } from '../../components';
import { Agency, Vehicle, Review } from '../../types';
import { getVehiclesByAgency, getReviewsByAgency } from '../../services/databaseService';
// ...

const AgencyDetailsScreen = ({ navigation, route }: any) => {
    const { agency } = route.params as { agency: Agency };
    const [activeTab, setActiveTab] = useState<'vehicles' | 'reviews' | 'info'>('vehicles');
    const [agencyVehicles, setAgencyVehicles] = useState<Vehicle[]>([]);
    const [agencyReviews, setAgencyReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [agency.id]);

    const loadData = async () => {
        try {
            const [vehicles, reviews] = await Promise.all([
                getVehiclesByAgency(agency.id),
                getReviewsByAgency(agency.id)
            ]);
            setAgencyVehicles(vehicles);
            setAgencyReviews(reviews);
        } catch (error) {
            console.error('Error loading agency details:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={i <= rating ? styles.starFilled : styles.starEmpty}>
                    ★
                </Text>
            );
        }
        return stars;
    };

    const getDayName = (day: string) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.headerImage}>
                    {agency.coverPhotoUrl ? (
                        <Image source={{ uri: agency.coverPhotoUrl }} style={styles.coverImage} />
                    ) : (
                        <View style={styles.coverPlaceholder}>
                            <Text style={styles.coverPlaceholderText}>🚗</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerOverlay}>
                        <View style={styles.agencyLogo}>
                            {agency.logoUrl ? (
                                <Image source={{ uri: agency.logoUrl }} style={styles.logoImage} />
                            ) : (
                                <Text style={styles.logoText}>{agency.name.charAt(0)}</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Agency Info */}
                <View style={styles.agencyInfo}>
                    <Text style={styles.agencyName}>{agency.name}</Text>
                    <View style={styles.ratingRow}>
                        {renderStars(Math.round(agency.averageRating || 0))}
                        <Text style={styles.ratingText}>
                            {(agency.averageRating || 0).toFixed(1)} ({agency.totalReviews || 0} reviews)
                        </Text>
                    </View>
                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>
                            {agency.address.street}, {agency.address.city}
                        </Text>
                    </View>
                    <View style={styles.badgesRow}>
                        {agency.verificationStatus === 'verified' && (
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.badgeText}>✓ Verified</Text>
                            </View>
                        )}
                        {agency.deliveryAvailable && (
                            <View style={styles.deliveryBadge}>
                                <Text style={styles.badgeText}>🚚 Delivery Available</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{agencyVehicles.length}</Text>
                        <Text style={styles.statLabel}>Vehicles</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{agency.totalReviews}</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{(agency.averageRating || 0).toFixed(1)}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['vehicles', 'reviews', 'info'] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'vehicles' && (
                        <>
                            {agencyVehicles.length > 0 ? (
                                agencyVehicles.map((vehicle) => (
                                    <VehicleCard
                                        key={vehicle.id}
                                        vehicle={vehicle}
                                        onPress={() =>
                                            navigation.navigate('VehicleDetails', { vehicle, agency })
                                        }
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyIcon}>🚗</Text>
                                    <Text style={styles.emptyText}>No vehicles available</Text>
                                </View>
                            )}
                        </>
                    )}

                    {activeTab === 'reviews' && (
                        <>
                            {agencyReviews.length > 0 ? (
                                agencyReviews.map((review) => (
                                    <View key={review.id} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <View style={styles.reviewerInfo}>
                                                <View style={styles.reviewerAvatar}>
                                                    <Text style={styles.reviewerInitial}>
                                                        {review.isAnonymous ? '?' : review.user?.name?.charAt(0) || 'U'}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.reviewerName}>
                                                        {review.isAnonymous ? 'Anonymous' : review.user?.name}
                                                    </Text>
                                                    <Text style={styles.reviewDate}>
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.reviewRating}>
                                                {renderStars(review.overallRating)}
                                            </View>
                                        </View>
                                        {review.comment && (
                                            <Text style={styles.reviewComment}>{review.comment}</Text>
                                        )}
                                        <View style={styles.reviewRatings}>
                                            <View style={styles.reviewRatingItem}>
                                                <Text style={styles.ratingItemLabel}>Cleanliness</Text>
                                                <Text style={styles.ratingItemValue}>{review.cleanlinessRating}/5</Text>
                                            </View>
                                            <View style={styles.reviewRatingItem}>
                                                <Text style={styles.ratingItemLabel}>Condition</Text>
                                                <Text style={styles.ratingItemValue}>{review.conditionRating}/5</Text>
                                            </View>
                                            <View style={styles.reviewRatingItem}>
                                                <Text style={styles.ratingItemLabel}>Staff</Text>
                                                <Text style={styles.ratingItemValue}>{review.staffRating}/5</Text>
                                            </View>
                                            <View style={styles.reviewRatingItem}>
                                                <Text style={styles.ratingItemLabel}>Value</Text>
                                                <Text style={styles.ratingItemValue}>{review.valueRating}/5</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyIcon}>⭐</Text>
                                    <Text style={styles.emptyText}>No reviews yet</Text>
                                </View>
                            )}
                        </>
                    )}

                    {activeTab === 'info' && (
                        <View style={styles.infoSection}>
                            <View style={styles.infoCard}>
                                <Text style={styles.infoTitle}>Contact Information</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>📞</Text>
                                    <Text style={styles.infoValue}>{agency.contactPhone}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>✉️</Text>
                                    <Text style={styles.infoValue}>{agency.contactEmail}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>📍</Text>
                                    <Text style={styles.infoValue}>
                                        {agency.address.street}, {agency.address.city}, {agency.address.country}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoCard}>
                                <Text style={styles.infoTitle}>Operating Hours</Text>
                                {Object.entries(agency.operatingHours).map(([day, hours]) => (
                                    <View key={day} style={styles.hoursRow}>
                                        <Text style={styles.dayName}>{getDayName(day)}</Text>
                                        <Text style={hours.isOpen ? styles.hoursOpen : styles.hoursClosed}>
                                            {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Contact Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.callButton}>
                    <Text style={styles.callIcon}>📞</Text>
                </TouchableOpacity>
                <Button
                    title="View Available Cars"
                    onPress={() => setActiveTab('vehicles')}
                    fullWidth
                    size="lg"
                    style={styles.viewCarsButton}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    headerImage: {
        height: 220,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    coverPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverPlaceholderText: {
        fontSize: 64,
    },
    backButton: {
        position: 'absolute',
        top: spacing.lg,
        left: spacing.lg,
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    backIcon: {
        fontSize: 20,
        fontWeight: '600',
    },
    headerOverlay: {
        position: 'absolute',
        bottom: -40,
        left: spacing.lg,
    },
    agencyLogo: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.background.primary,
        ...shadows.lg,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: borderRadius.lg - 4,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text.inverse,
    },
    agencyInfo: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing['3xl'],
        paddingBottom: spacing.lg,
        backgroundColor: colors.background.primary,
    },
    agencyName: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    starFilled: {
        color: colors.secondary[500],
        fontSize: typography.fontSize.md,
    },
    starEmpty: {
        color: colors.neutral[300],
        fontSize: typography.fontSize.md,
    },
    ratingText: {
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    locationIcon: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.xs,
    },
    locationText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    verifiedBadge: {
        backgroundColor: colors.success.light,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    deliveryBadge: {
        backgroundColor: colors.primary[100],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '500',
        color: colors.text.primary,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        marginTop: spacing.sm,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.primary[500],
    },
    statLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.neutral[200],
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.base,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.primary[500],
    },
    tabText: {
        fontSize: typography.fontSize.base,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    tabTextActive: {
        color: colors.primary[500],
    },
    tabContent: {
        padding: spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['3xl'],
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
    },
    reviewCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    reviewerInitial: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.primary[600],
    },
    reviewerName: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
    },
    reviewDate: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    reviewRating: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    reviewRatings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    reviewRatingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    ratingItemLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginRight: spacing.xs,
    },
    ratingItemValue: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
        color: colors.text.primary,
    },
    infoSection: {},
    infoCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    infoTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    infoIcon: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.md,
    },
    infoValue: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    hoursRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    dayName: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        fontWeight: '500',
    },
    hoursOpen: {
        fontSize: typography.fontSize.sm,
        color: colors.success.main,
    },
    hoursClosed: {
        fontSize: typography.fontSize.sm,
        color: colors.error.main,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    callButton: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    callIcon: {
        fontSize: 24,
    },
    viewCarsButton: {
        flex: 1,
    },
});

export default AgencyDetailsScreen;

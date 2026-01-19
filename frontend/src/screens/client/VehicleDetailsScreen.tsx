import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Button } from '../../components';
import { Vehicle, Agency } from '../../types';

const { width } = Dimensions.get('window');

const VehicleDetailsScreen = ({ navigation, route }: any) => {
    const { vehicle, agency } = route.params as { vehicle: Vehicle; agency?: Agency };
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const features = vehicle.features || [];
    const images = vehicle.images?.length > 0
        ? vehicle.images
        : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'];

    const getFeatureIcon = (feature: string) => {
        const icons: Record<string, string> = {
            'AC': '❄️',
            'Bluetooth': '📱',
            'USB': '🔌',
            'GPS Navigation': '🧭',
            'Backup Camera': '📷',
            'Leather Seats': '💺',
            'Sunroof': '☀️',
            'Premium Sound': '🎵',
            'Heated Seats': '🔥',
            '4WD': '🏔️',
            'Roof Rails': '🧳',
            'Parking Sensors': '🅿️',
        };
        return icons[feature] || '✓';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setCurrentImageIndex(index);
                        }}
                    >
                        {images.map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={styles.image} />
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.imageDots}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, index === currentImageIndex && styles.dotActive]}
                            />
                        ))}
                    </View>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{vehicle.category.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Vehicle Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.vehicleName}>
                                {vehicle.make} {vehicle.model}
                            </Text>
                            <Text style={styles.vehicleYear}>{vehicle.year}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${vehicle.dailyRate}</Text>
                            <Text style={styles.priceLabel}>/day</Text>
                        </View>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.star}>⭐</Text>
                        <Text style={styles.ratingText}>{(vehicle.averageRating || 0).toFixed(1)}</Text>
                        {!vehicle.isAvailable && (
                            <View style={styles.unavailableBadge}>
                                <Text style={styles.unavailableText}>Currently Unavailable</Text>
                            </View>
                        )}
                    </View>

                    {/* Specs Grid */}
                    <View style={styles.specsContainer}>
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>⚙️</Text>
                            <Text style={styles.specValue}>
                                {vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}
                            </Text>
                            <Text style={styles.specLabel}>Transmission</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>⛽</Text>
                            <Text style={styles.specValue}>{vehicle.fuelType}</Text>
                            <Text style={styles.specLabel}>Fuel Type</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>👥</Text>
                            <Text style={styles.specValue}>{vehicle.seats}</Text>
                            <Text style={styles.specLabel}>Seats</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>🚪</Text>
                            <Text style={styles.specValue}>{vehicle.doors}</Text>
                            <Text style={styles.specLabel}>Doors</Text>
                        </View>
                    </View>

                    {/* Features */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Features</Text>
                        <View style={styles.featuresGrid}>
                            {features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <Text style={styles.featureIcon}>{getFeatureIcon(feature)}</Text>
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Pricing */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pricing</Text>
                        <View style={styles.pricingCard}>
                            <View style={styles.pricingRow}>
                                <Text style={styles.pricingLabel}>Daily Rate</Text>
                                <Text style={styles.pricingValue}>${vehicle.dailyRate}</Text>
                            </View>
                            {vehicle.weeklyRate && (
                                <View style={styles.pricingRow}>
                                    <Text style={styles.pricingLabel}>Weekly Rate</Text>
                                    <Text style={styles.pricingValue}>${vehicle.weeklyRate}</Text>
                                </View>
                            )}
                            {vehicle.monthlyRate && (
                                <View style={styles.pricingRow}>
                                    <Text style={styles.pricingLabel}>Monthly Rate</Text>
                                    <Text style={styles.pricingValue}>${vehicle.monthlyRate}</Text>
                                </View>
                            )}
                            {vehicle.deliveryAvailable && (
                                <View style={styles.pricingRow}>
                                    <View style={styles.deliveryLabel}>
                                        <Text style={styles.pricingLabel}>Delivery Fee</Text>
                                        <Text style={styles.deliveryBadge}>🚚 Available</Text>
                                    </View>
                                    <Text style={styles.pricingValue}>
                                        {vehicle.deliveryFee > 0 ? `$${vehicle.deliveryFee}` : 'Free'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Agency Info */}
                    {agency && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Rental Agency</Text>
                            <TouchableOpacity
                                style={styles.agencyCard}
                                onPress={() => navigation.navigate('AgencyDetails', { agency })}
                            >
                                <View style={styles.agencyLogo}>
                                    {agency.logoUrl ? (
                                        <Image source={{ uri: agency.logoUrl }} style={styles.agencyLogoImage} />
                                    ) : (
                                        <Text style={styles.agencyLogoText}>{agency.name.charAt(0)}</Text>
                                    )}
                                </View>
                                <View style={styles.agencyInfo}>
                                    <Text style={styles.agencyName}>{agency.name}</Text>
                                    <View style={styles.agencyRating}>
                                        <Text style={styles.star}>⭐</Text>
                                        <Text style={styles.agencyRatingText}>
                                            {(agency.averageRating || 0).toFixed(1)} ({agency.totalReviews || 0} reviews)
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.agencyArrow}>→</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerPrice}>
                    <Text style={styles.footerPriceValue}>${vehicle.dailyRate}</Text>
                    <Text style={styles.footerPriceLabel}>/day</Text>
                </View>
                <Button
                    title={vehicle.isAvailable ? 'Book Now' : 'Not Available'}
                    onPress={() =>
                        navigation.navigate('Booking', { vehicle, agency })
                    }
                    disabled={!vehicle.isAvailable}
                    size="lg"
                    style={styles.bookButton}
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
    imageContainer: {
        height: 280,
        position: 'relative',
    },
    image: {
        width: width,
        height: 280,
        resizeMode: 'cover',
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
    imageDots: {
        position: 'absolute',
        bottom: spacing.lg,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: colors.text.inverse,
        width: 24,
    },
    categoryBadge: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    categoryText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.xs,
        fontWeight: '700',
    },
    infoContainer: {
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: -spacing.lg,
        padding: spacing.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    vehicleName: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
    },
    vehicleYear: {
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.primary[500],
    },
    priceLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    star: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.xs,
    },
    ratingText: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
        color: colors.text.primary,
    },
    unavailableBadge: {
        marginLeft: spacing.md,
        backgroundColor: colors.error.light,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    unavailableText: {
        fontSize: typography.fontSize.xs,
        color: colors.error.dark,
        fontWeight: '500',
    },
    specsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.xl,
    },
    specItem: {
        flex: 1,
        alignItems: 'center',
    },
    specIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    specValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
        textTransform: 'capitalize',
    },
    specLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        marginTop: 2,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    featureIcon: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.xs,
    },
    featureText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    pricingCard: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.lg,
        padding: spacing.base,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
    },
    pricingLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    pricingValue: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
    },
    deliveryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    deliveryBadge: {
        fontSize: typography.fontSize.xs,
        color: colors.success.main,
    },
    agencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.lg,
        padding: spacing.base,
    },
    agencyLogo: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    agencyLogoImage: {
        width: '100%',
        height: '100%',
    },
    agencyLogoText: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.text.inverse,
    },
    agencyInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    agencyName: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
    },
    agencyRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    agencyRatingText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    agencyArrow: {
        fontSize: typography.fontSize.xl,
        color: colors.neutral[400],
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    footerPrice: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginRight: spacing.lg,
    },
    footerPriceValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.primary[500],
    },
    footerPriceLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    bookButton: {
        flex: 1,
    },
});

export default VehicleDetailsScreen;

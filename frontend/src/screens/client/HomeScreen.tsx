import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { AgencyCard, VehicleCard } from '../../components';
import { useAuthStore, useLocationStore, useFilterStore } from '../../stores';
import { getAgencies, getAllVehicles } from '../../services/databaseService';
import { Agency, Vehicle } from '../../types';

const HomeScreen = ({ navigation }: any) => {
    const { user } = useAuthStore();
    const { currentLocation, setCurrentLocation, setLocationPermission } = useLocationStore();
    const { agencyFilters, setAgencyFilters } = useFilterStore();

    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
    const [selectedRadius, setSelectedRadius] = useState(25);

    const radiusOptions = [5, 10, 25, 50];

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted' ? 'granted' : 'denied');

            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setCurrentLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        } catch (error) {
            console.log('Error getting location:', error);
        } finally {
            loadData();
        }
    };

    const loadData = async () => {
        try {
            const allAgencies = await getAgencies();
            const allVehicles = await getAllVehicles();

            // Filter agencies by distance
            const filteredAgencies = allAgencies
                .filter((a) => (a.distance || 0) <= selectedRadius)
                .filter((a) => a.averageRating >= agencyFilters.minRating)
                .sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setAgencies(filteredAgencies);
            setFeaturedVehicles(allVehicles.filter((v) => v.isAvailable).slice(0, 5));
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await loadData();
        setRefreshing(false);
    };

    const filteredAgencies = agencies.filter(
        (agency) =>
            agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agency.address.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.loadingText}>Finding nearby agencies...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'}! 👋</Text>
                        <Text style={styles.subGreeting}>Find your perfect ride</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search agencies or locations..."
                            placeholderTextColor={colors.neutral[400]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={styles.clearIcon}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

                {/* Location Info */}
                <View style={styles.locationContainer}>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>
                            {currentLocation ? 'Current Location' : 'Location not available'}
                        </Text>
                    </View>
                    <View style={styles.radiusSelector}>
                        {radiusOptions.map((radius) => (
                            <TouchableOpacity
                                key={radius}
                                style={[
                                    styles.radiusButton,
                                    selectedRadius === radius && styles.radiusButtonActive,
                                ]}
                                onPress={() => {
                                    setSelectedRadius(radius);
                                    setAgencyFilters({ radius });
                                    loadData();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.radiusText,
                                        selectedRadius === radius && styles.radiusTextActive,
                                    ]}
                                >
                                    {radius}km
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Vehicles */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured Cars</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All →</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={featuredVehicles}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <VehicleCard
                                vehicle={item}
                                compact
                                onPress={() => navigation.navigate('VehicleDetails', { vehicle: item })}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                </View>

                {/* Nearby Agencies */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Agencies</Text>
                        <Text style={styles.agencyCount}>{filteredAgencies.length} found</Text>
                    </View>
                    {filteredAgencies.length > 0 ? (
                        filteredAgencies.map((agency) => (
                            <AgencyCard
                                key={agency.id}
                                agency={agency}
                                onPress={() => navigation.navigate('AgencyDetails', { agency })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={styles.emptyTitle}>No agencies found</Text>
                            <Text style={styles.emptySubtitle}>
                                Try increasing the search radius or changing filters
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    greeting: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.text.primary,
    },
    subGreeting: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    notificationIcon: {
        fontSize: 20,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error.main,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        ...shadows.sm,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    clearIcon: {
        fontSize: 16,
        color: colors.neutral[400],
        padding: spacing.xs,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    filterIcon: {
        fontSize: 20,
    },
    locationContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    locationIcon: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    locationText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    radiusSelector: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        padding: spacing.xs,
        ...shadows.sm,
    },
    radiusButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.sm,
    },
    radiusButtonActive: {
        backgroundColor: colors.primary[500],
    },
    radiusText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    radiusTextActive: {
        color: colors.text.inverse,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
    },
    seeAllText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary[500],
        fontWeight: '500',
    },
    agencyCount: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
    },
    horizontalList: {
        paddingRight: spacing.lg,
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
    emptyTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});

export default HomeScreen;

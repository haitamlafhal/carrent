import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAuthStore } from '../../stores';
import { getAgencies, getBookingsByAgency, getVehiclesByAgency } from '../../services/databaseService';
import { Agency, Booking, Vehicle } from '../../types';

const DashboardScreen = ({ navigation }: any) => {
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const fetchData = async () => {
        try {
            // 1. Find the mananger's agency
            const allAgencies = await getAgencies();
            // Match by name loosely or exact
            const myAgency = allAgencies.find(a => a.name === user?.agencyName);

            setAgency(myAgency || null);

            if (myAgency) {
                // 2. Fetch related data
                const [agencyBookings, agencyVehicles] = await Promise.all([
                    getBookingsByAgency(myAgency.id),
                    getVehiclesByAgency(myAgency.id)
                ]);
                setBookings(agencyBookings);
                setVehicles(agencyVehicles);
            } else {
                // Reset if no agency found
                setBookings([]);
                setVehicles([]);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        fetchData();
    };

    // Calculate real stats
    const pendingBookings = bookings.filter((b) => b.status === 'pending');
    const activeBookings = bookings.filter((b) => b.status === 'in_progress' || b.status === 'confirmed');
    const availableVehicles = vehicles.filter((v) => v.isAvailable);
    const monthlyRevenue = bookings
        .filter((b) => b.status === 'completed' || b.status === 'in_progress')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const QuickStat = ({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </SafeAreaView>
        );
    }

    if (!agency) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No Agency Found</Text>
                    <Text style={styles.emptyText}>
                        You are registered as a manager for "{user?.agencyName}", but we couldn't find an agency with that name.
                    </Text>
                    <TouchableOpacity style={styles.createButton} onPress={() => {/* TODO: Create Agency Flow */ }}>
                        <Text style={styles.createButtonText}>Create Agency Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.agencyName}>{agency.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        {pendingBookings.length > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>{pendingBookings.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <QuickStat
                        icon="📬"
                        value={pendingBookings.length}
                        label="Pending Requests"
                        color={colors.status.pending}
                    />
                    <QuickStat
                        icon="🚗"
                        value={activeBookings.length}
                        label="Active Rentals"
                        color={colors.status.inProgress}
                    />
                    <QuickStat
                        icon="🅿️"
                        value={availableVehicles.length}
                        label="Available Cars"
                        color={colors.success.main}
                    />
                    <QuickStat
                        icon="💰"
                        value={`$${monthlyRevenue.toLocaleString()}`}
                        label="Total Revenue"
                        color={colors.primary[500]}
                    />
                </View>

                {/* Pending Requests */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pending Requests</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Requests')}>
                            <Text style={styles.seeAllText}>See All →</Text>
                        </TouchableOpacity>
                    </View>
                    {pendingBookings.length > 0 ? (
                        pendingBookings.slice(0, 2).map((booking) => (
                            <TouchableOpacity
                                key={booking.id}
                                style={styles.requestCard}
                                onPress={() => navigation.navigate('Requests')}
                            >
                                <View style={styles.requestHeader}>
                                    <View style={styles.clientInfo}>
                                        <View style={styles.clientAvatar}>
                                            <Text style={styles.avatarText}>
                                                {booking.user?.name?.charAt(0) || 'U'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.clientName}>{booking.user?.name}</Text>
                                            <View style={styles.clientRating}>
                                                <Text style={styles.starIcon}>⭐</Text>
                                                <Text style={styles.ratingText}>
                                                    {(booking.user?.averageRating || 0).toFixed(1)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.pendingBadge}>
                                        <Text style={styles.pendingText}>Pending</Text>
                                    </View>
                                </View>
                                <View style={styles.requestDetails}>
                                    <Text style={styles.vehicleName}>
                                        {booking.vehicle?.make} {booking.vehicle?.model}
                                    </Text>
                                    <Text style={styles.requestDates}>
                                        {new Date(booking.startDate).toLocaleDateString()} -{' '}
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.requestFooter}>
                                    <Text style={styles.requestPrice}>${booking.totalPrice}</Text>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.rejectButton}>
                                            <Text style={styles.rejectText}>✕</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.acceptButton}>
                                            <Text style={styles.acceptText}>✓</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyRequests}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyText}>No pending requests</Text>
                        </View>
                    )}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('AddVehicle')}
                        >
                            <Text style={styles.actionIcon}>➕</Text>
                            <Text style={styles.actionText}>Add Vehicle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('Fleet')}
                        >
                            <Text style={styles.actionIcon}>🚗</Text>
                            <Text style={styles.actionText}>Manage Fleet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>📊</Text>
                            <Text style={styles.actionText}>Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>⚙️</Text>
                            <Text style={styles.actionText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background.primary,
    },
    welcomeText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    agencyName: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.text.primary,
        marginTop: spacing.xs,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationIcon: {
        fontSize: 20,
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.error.main,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.inverse,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.md,
        backgroundColor: colors.background.primary,
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    statCard: {
        width: '47%',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.base,
        borderLeftWidth: 4,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.text.primary,
    },
    statLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    section: {
        backgroundColor: colors.background.primary,
        padding: spacing.lg,
        marginBottom: spacing.sm,
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
    requestCard: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.md,
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clientAvatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.inverse,
    },
    clientName: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
    },
    clientRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    starIcon: {
        fontSize: typography.fontSize.xs,
        marginRight: 2,
    },
    ratingText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    pendingBadge: {
        backgroundColor: colors.warning.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    pendingText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '500',
        color: colors.warning.dark,
    },
    requestDetails: {
        marginBottom: spacing.md,
    },
    vehicleName: {
        fontSize: typography.fontSize.base,
        fontWeight: '500',
        color: colors.text.primary,
    },
    requestDates: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    requestFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestPrice: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.primary[500],
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    rejectButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.error.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectText: {
        fontSize: 18,
        color: colors.error.main,
        fontWeight: '700',
    },
    acceptButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.success.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptText: {
        fontSize: 18,
        color: colors.text.inverse,
        fontWeight: '700',
    },
    emptyRequests: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    emptyText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    actionCard: {
        width: '47%',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 28,
        marginBottom: spacing.sm,
    },
    actionText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.xl,
    },
    createButtonText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.md,
        fontWeight: '600',
    },
    refreshButton: {
        marginTop: spacing.md,
    },
    refreshButtonText: {
        color: colors.primary[500],
        fontSize: typography.fontSize.sm,
    },
});

export default DashboardScreen;

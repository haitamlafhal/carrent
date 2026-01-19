import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { BookingCard } from '../../components';
import { getBookingsByUser } from '../../services/databaseService';
import { useAuthStore } from '../../stores';
import { Booking, BookingStatus } from '../../types';

const BookingsScreen = ({ navigation }: any) => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const activeStatuses: BookingStatus[] = ['pending', 'confirmed', 'in_progress'];
    const historyStatuses: BookingStatus[] = ['completed', 'cancelled', 'rejected'];

    const loadBookings = useCallback(async () => {
        if (!user) return;
        try {
            const userBookings = await getBookingsByUser(user.id);
            setBookings(userBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadBookings();
        }, [loadBookings])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const activeBookings = bookings.filter((b) => activeStatuses.includes(b.status));
    const historyBookings = bookings.filter((b) => historyStatuses.includes(b.status));

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Bookings</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active
                    </Text>
                    {activeBookings.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{activeBookings.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'history' && styles.tabActive]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                        History
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {activeTab === 'active' ? (
                    <>
                        {activeBookings.length > 0 ? (
                            activeBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onPress={() => navigation.navigate('BookingDetails', { booking })}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>📋</Text>
                                <Text style={styles.emptyTitle}>No Active Bookings</Text>
                                <Text style={styles.emptySubtitle}>
                                    Your upcoming and ongoing rentals will appear here
                                </Text>
                                <TouchableOpacity
                                    style={styles.exploreButton}
                                    onPress={() => navigation.navigate('Home')}
                                >
                                    <Text style={styles.exploreButtonText}>Explore Cars</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {historyBookings.length > 0 ? (
                            historyBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onPress={() => {
                                        if (booking.status === 'completed') {
                                            navigation.navigate('Rating', { booking, type: 'client' });
                                        }
                                    }}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>📜</Text>
                                <Text style={styles.emptyTitle}>No Booking History</Text>
                                <Text style={styles.emptySubtitle}>
                                    Your past rentals will appear here
                                </Text>
                            </View>
                        )}
                    </>
                )}
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
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.background.primary,
    },
    headerTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginRight: spacing.xl,
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
    tabBadge: {
        marginLeft: spacing.xs,
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    tabBadgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
        color: colors.text.inverse,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['4xl'],
        paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    exploreButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    exploreButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
        color: colors.text.inverse,
    },
});

export default BookingsScreen;

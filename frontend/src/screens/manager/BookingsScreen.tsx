import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { BookingCard } from '../../components';
import { useAuthStore } from '../../stores';
import { getAgencies, getBookingsByAgency } from '../../services/databaseService';
import { Agency, Booking, BookingStatus } from '../../types';

const BookingsScreen = ({ navigation }: any) => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Real state
    const [agency, setAgency] = useState<Agency | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchData = async () => {
        try {
            const allAgencies = await getAgencies();
            const myAgency = allAgencies.find(a => a.name === user?.agencyName);
            setAgency(myAgency || null);

            if (myAgency) {
                const agencyBookings = await getBookingsByAgency(myAgency.id);
                setBookings(agencyBookings);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
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

    const pendingBookings = bookings.filter((b) => b.status === 'pending');
    const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
    const completedBookings = bookings.filter((b) => b.status === 'completed');

    const getBookingsForTab = () => {
        switch (activeTab) {
            case 'pending':
                return pendingBookings;
            case 'active':
                return activeBookings;
            case 'completed':
                return completedBookings;
            default:
                return [];
        }
    };

    const handleAccept = (bookingId: string) => {
        Alert.alert(
            'Accept Booking',
            'Are you sure you want to accept this booking request?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        // TODO: Implement Accept API
                        Alert.alert('Success', 'Booking accepted! The customer has been notified.');
                        fetchData();
                    },
                },
            ]
        );
    };

    const handleReject = (bookingId: string) => {
        Alert.alert(
            'Reject Booking',
            'Select a reason for rejection:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Vehicle Unavailable',
                    onPress: () => {
                        // TODO: Implement Reject API
                        Alert.alert('Booking Rejected', 'The customer has been notified.');
                        fetchData();
                    },
                },
                {
                    text: 'Low Rating',
                    onPress: () => Alert.alert('Booking Rejected', 'The customer has been notified.'),
                },
                {
                    text: 'Other',
                    onPress: () => Alert.alert('Booking Rejected', 'The customer has been notified.'),
                },
            ]
        );
    };

    const currentBookings = getBookingsForTab();

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Loading Bookings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!agency) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No Agency Found</Text>
                    <Text style={styles.emptySubtitle}>Please contact support or create an agency profile.</Text>
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Booking Requests</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                        Pending
                    </Text>
                    {pendingBookings.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{pendingBookings.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                        Completed
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
                {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            showActions={activeTab === 'pending'}
                            onPress={() => {
                                if (activeTab === 'completed') {
                                    navigation.navigate('Rating', { booking, type: 'manager' });
                                }
                            }}
                            onAccept={() => handleAccept(booking.id)}
                            onReject={() => handleReject(booking.id)}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>
                            {activeTab === 'pending' ? '📭' : activeTab === 'active' ? '🚗' : '📋'}
                        </Text>
                        <Text style={styles.emptyTitle}>
                            No {activeTab} bookings
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {activeTab === 'pending'
                                ? 'New booking requests will appear here'
                                : activeTab === 'active'
                                    ? 'Ongoing rentals will appear here'
                                    : 'Completed bookings will appear here'}
                        </Text>
                    </View>
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
        backgroundColor: colors.error.main,
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
        textTransform: 'capitalize',
    },
    emptySubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});

export default BookingsScreen;

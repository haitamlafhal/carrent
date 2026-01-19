import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../theme';
import { Booking, BookingStatus } from '../../types';

interface BookingCardProps {
    booking: Booking;
    onPress: () => void;
    showActions?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    onPress,
    showActions = false,
    onAccept,
    onReject,
}) => {
    const getStatusConfig = (status: BookingStatus) => {
        const configs: Record<BookingStatus, { color: string; bg: string; icon: string; label: string }> = {
            pending: { color: colors.status.pending, bg: '#FEF3C7', icon: '🟡', label: 'Pending' },
            confirmed: { color: colors.status.confirmed, bg: '#D1FAE5', icon: '🟢', label: 'Confirmed' },
            in_progress: { color: colors.status.inProgress, bg: '#DBEAFE', icon: '🔵', label: 'In Progress' },
            completed: { color: colors.status.completed, bg: '#F3F4F6', icon: '⚪', label: 'Completed' },
            cancelled: { color: colors.status.cancelled, bg: '#FEE2E2', icon: '🔴', label: 'Cancelled' },
            rejected: { color: colors.status.rejected, bg: '#FEE2E2', icon: '❌', label: 'Rejected' },
        };
        return configs[status];
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDuration = () => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const statusConfig = getStatusConfig(booking.status);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.header}>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {statusConfig.label}
                    </Text>
                </View>
                <Text style={styles.bookingId}>#{booking.id.slice(-6).toUpperCase()}</Text>
            </View>

            <View style={styles.vehicleInfo}>
                {booking.vehicle?.images && booking.vehicle.images.length > 0 ? (
                    <Image source={{ uri: booking.vehicle.images[0] }} style={styles.vehicleImage} />
                ) : (
                    <View style={styles.vehiclePlaceholder}>
                        <Text style={styles.placeholderEmoji}>🚗</Text>
                    </View>
                )}
                <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleName}>
                        {booking.vehicle?.make} {booking.vehicle?.model}
                    </Text>
                    <Text style={styles.agencyName}>{booking.agency?.name}</Text>
                    <View style={styles.deliveryBadge}>
                        <Text style={styles.deliveryIcon}>
                            {booking.deliveryType === 'delivery' ? '🚚' : '📍'}
                        </Text>
                        <Text style={styles.deliveryText}>
                            {booking.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.dateSection}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>From</Text>
                    <Text style={styles.dateValue}>{formatDate(booking.startDate)}</Text>
                </View>
                <View style={styles.dateDivider}>
                    <Text style={styles.durationText}>{getDuration()} days</Text>
                    <View style={styles.durationLine} />
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>To</Text>
                    <Text style={styles.dateValue}>{formatDate(booking.endDate)}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.priceInfo}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${booking.totalPrice.toFixed(2)}</Text>
                </View>

                {showActions && booking.status === 'pending' && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={onReject}
                        >
                            <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={onAccept}
                        >
                            <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {showActions && booking.user && (
                <View style={styles.clientInfo}>
                    <View style={styles.clientAvatar}>
                        {booking.user.profilePhotoUrl ? (
                            <Image source={{ uri: booking.user.profilePhotoUrl }} style={styles.clientImage} />
                        ) : (
                            <Text style={styles.clientInitial}>{booking.user.name.charAt(0)}</Text>
                        )}
                    </View>
                    <View style={styles.clientDetails}>
                        <Text style={styles.clientName}>{booking.user.name}</Text>
                        <View style={styles.clientRating}>
                            <Text style={styles.starIcon}>⭐</Text>
                            <Text style={styles.clientRatingText}>
                                {booking.user.averageRating.toFixed(1)} • {booking.user.totalRentals} rentals
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.base,
        ...shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    statusIcon: {
        marginRight: spacing.xs,
        fontSize: typography.fontSize.xs,
    },
    statusText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
    },
    bookingId: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
        fontWeight: '500',
    },
    vehicleInfo: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    vehicleImage: {
        width: 80,
        height: 60,
        borderRadius: borderRadius.md,
    },
    vehiclePlaceholder: {
        width: 80,
        height: 60,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderEmoji: {
        fontSize: 28,
    },
    vehicleDetails: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    vehicleName: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
    },
    agencyName: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    deliveryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    deliveryIcon: {
        fontSize: typography.fontSize.sm,
        marginRight: spacing.xs,
    },
    deliveryText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    dateItem: {
        flex: 1,
    },
    dateLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        marginBottom: spacing.xs,
    },
    dateValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
    },
    dateDivider: {
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
    },
    durationText: {
        fontSize: typography.fontSize.xs,
        color: colors.primary[500],
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    durationLine: {
        width: 40,
        height: 2,
        backgroundColor: colors.primary[200],
        borderRadius: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceInfo: {},
    totalLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
    },
    totalPrice: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.primary[500],
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        marginLeft: spacing.sm,
    },
    rejectButton: {
        backgroundColor: colors.neutral[100],
    },
    rejectButtonText: {
        color: colors.text.secondary,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
    },
    acceptButton: {
        backgroundColor: colors.success.main,
    },
    acceptButtonText: {
        color: colors.text.inverse,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    clientAvatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    clientImage: {
        width: '100%',
        height: '100%',
    },
    clientInitial: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.primary[600],
    },
    clientDetails: {
        marginLeft: spacing.md,
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
        fontSize: typography.fontSize.sm,
        marginRight: spacing.xs,
    },
    clientRatingText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
});

export default BookingCard;

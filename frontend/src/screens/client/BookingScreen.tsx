import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Button, Input } from '../../components';
import { Vehicle, Agency } from '../../types';
import { useBookingStore } from '../../stores';

const BookingScreen = ({ navigation, route }: any) => {
    const { vehicle, agency } = route.params as { vehicle: Vehicle; agency?: Agency };
    const { setDates, setDeliveryType, setDeliveryAddress, deliveryType, deliveryAddress } = useBookingStore();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    const [selectedDelivery, setSelectedDelivery] = useState<'pickup' | 'delivery'>('pickup');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Calculate days and pricing
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const basePrice = vehicle.dailyRate * diffDays;
    const deliveryFee = selectedDelivery === 'delivery' ? (vehicle.deliveryFee || 0) : 0;
    const serviceFee = Math.round(basePrice * 0.05); // 5% service fee
    const totalPrice = basePrice + deliveryFee + serviceFee;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleConfirmBooking = async () => {
        if (selectedDelivery === 'delivery' && !address.trim()) {
            Alert.alert('Missing Address', 'Please enter a delivery address');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                'Booking Submitted! 🎉',
                'Your booking request has been sent to the agency. You will receive a notification once they respond.',
                [
                    {
                        text: 'View Bookings',
                        onPress: () => navigation.navigate('ClientMain', { screen: 'Bookings' }),
                    },
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Complete Booking</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Vehicle Summary */}
                <View style={styles.vehicleSummary}>
                    <Image
                        source={{ uri: vehicle.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800' }}
                        style={styles.vehicleImage}
                    />
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>
                            {vehicle.make} {vehicle.model}
                        </Text>
                        <Text style={styles.vehicleYear}>{vehicle.year}</Text>
                        <Text style={styles.agencyName}>{agency?.name || 'Rental Agency'}</Text>
                    </View>
                </View>

                {/* Date Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rental Period</Text>
                    <View style={styles.dateContainer}>
                        <TouchableOpacity style={styles.dateCard}>
                            <Text style={styles.dateLabel}>Pick-up Date</Text>
                            <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
                            <Text style={styles.timeValue}>10:00 AM</Text>
                        </TouchableOpacity>
                        <View style={styles.dateDivider}>
                            <Text style={styles.daysText}>{diffDays} days</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        <TouchableOpacity style={styles.dateCard}>
                            <Text style={styles.dateLabel}>Return Date</Text>
                            <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                            <Text style={styles.timeValue}>10:00 AM</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Delivery Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Option</Text>
                    <View style={styles.deliveryOptions}>
                        <TouchableOpacity
                            style={[
                                styles.deliveryOption,
                                selectedDelivery === 'pickup' && styles.deliveryOptionActive,
                            ]}
                            onPress={() => setSelectedDelivery('pickup')}
                        >
                            <Text style={styles.deliveryIcon}>📍</Text>
                            <View style={styles.deliveryInfo}>
                                <Text style={[
                                    styles.deliveryTitle,
                                    selectedDelivery === 'pickup' && styles.deliveryTitleActive,
                                ]}>
                                    Self Pickup
                                </Text>
                                <Text style={styles.deliverySubtitle}>Pick up at agency location</Text>
                            </View>
                            <Text style={styles.deliveryPrice}>Free</Text>
                        </TouchableOpacity>

                        {vehicle.deliveryAvailable && (
                            <TouchableOpacity
                                style={[
                                    styles.deliveryOption,
                                    selectedDelivery === 'delivery' && styles.deliveryOptionActive,
                                ]}
                                onPress={() => setSelectedDelivery('delivery')}
                            >
                                <Text style={styles.deliveryIcon}>🚚</Text>
                                <View style={styles.deliveryInfo}>
                                    <Text style={[
                                        styles.deliveryTitle,
                                        selectedDelivery === 'delivery' && styles.deliveryTitleActive,
                                    ]}>
                                        Delivery
                                    </Text>
                                    <Text style={styles.deliverySubtitle}>Car delivered to your location</Text>
                                </View>
                                <Text style={styles.deliveryPrice}>
                                    {vehicle.deliveryFee > 0 ? `+$${vehicle.deliveryFee}` : 'Free'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {selectedDelivery === 'delivery' && (
                        <View style={styles.addressInput}>
                            <Input
                                label="Delivery Address"
                                placeholder="Enter your delivery address"
                                value={address}
                                onChangeText={setAddress}
                                leftIcon={<Text style={styles.inputIcon}>📍</Text>}
                            />
                        </View>
                    )}
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>
                    <View style={styles.priceCard}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>
                                ${vehicle.dailyRate} × {diffDays} days
                            </Text>
                            <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
                        </View>
                        {deliveryFee > 0 && (
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Delivery Fee</Text>
                                <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Service Fee (5%)</Text>
                            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceDivider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Terms */}
                <View style={styles.termsContainer}>
                    <TouchableOpacity style={styles.termsCheckbox}>
                        <Text style={styles.checkIcon}>☑️</Text>
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        I agree to the{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.termsLink}>Cancellation Policy</Text>
                    </Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerPrice}>
                    <Text style={styles.footerTotal}>${totalPrice.toFixed(2)}</Text>
                    <Text style={styles.footerLabel}>total for {diffDays} days</Text>
                </View>
                <Button
                    title="Confirm Booking"
                    onPress={handleConfirmBooking}
                    loading={isLoading}
                    size="lg"
                    style={styles.confirmButton}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    backButton: {
        fontSize: typography.fontSize.md,
        color: colors.primary[500],
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.text.primary,
    },
    placeholder: {
        width: 60,
    },
    vehicleSummary: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        padding: spacing.lg,
        marginBottom: spacing.sm,
    },
    vehicleImage: {
        width: 100,
        height: 70,
        borderRadius: borderRadius.md,
    },
    vehicleInfo: {
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    vehicleName: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
    },
    vehicleYear: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    agencyName: {
        fontSize: typography.fontSize.sm,
        color: colors.primary[500],
        marginTop: spacing.xs,
    },
    section: {
        backgroundColor: colors.background.primary,
        padding: spacing.lg,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateCard: {
        flex: 1,
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
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
    timeValue: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    dateDivider: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    daysText: {
        fontSize: typography.fontSize.xs,
        color: colors.primary[500],
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    dividerLine: {
        width: 30,
        height: 2,
        backgroundColor: colors.primary[200],
        borderRadius: 1,
    },
    deliveryOptions: {
        gap: spacing.md,
    },
    deliveryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    deliveryOptionActive: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    deliveryIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.text.primary,
    },
    deliveryTitleActive: {
        color: colors.primary[600],
    },
    deliverySubtitle: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    deliveryPrice: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.success.main,
    },
    addressInput: {
        marginTop: spacing.md,
    },
    inputIcon: {
        fontSize: typography.fontSize.md,
    },
    priceCard: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    priceLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    priceValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.primary,
    },
    priceDivider: {
        height: 1,
        backgroundColor: colors.neutral[200],
        marginVertical: spacing.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    totalLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.primary,
    },
    totalValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.primary[500],
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.lg,
        backgroundColor: colors.background.primary,
        marginBottom: spacing.sm,
    },
    termsCheckbox: {
        marginRight: spacing.sm,
    },
    checkIcon: {
        fontSize: typography.fontSize.md,
    },
    termsText: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    termsLink: {
        color: colors.primary[500],
        fontWeight: '500',
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
        marginRight: spacing.lg,
    },
    footerTotal: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.primary[500],
    },
    footerLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    confirmButton: {
        flex: 1,
    },
});

export default BookingScreen;

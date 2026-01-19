import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { RatingForm } from '../../components';
import { Booking } from '../../types';

const RatingScreen = ({ navigation, route }: any) => {
    const { booking, type } = route.params as { booking: Booking; type: 'client' | 'manager' };

    const handleSubmit = (ratings: any, comment: string) => {
        Alert.alert(
            'Thank You! ⭐',
            'Your rating has been submitted successfully.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rate {type === 'client' ? 'Experience' : 'Customer'}</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView>
                <View style={styles.bookingInfo}>
                    <Text style={styles.vehicleName}>{booking.vehicle?.make} {booking.vehicle?.model}</Text>
                    <Text style={styles.bookingDates}>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </Text>
                    {type === 'manager' && booking.user && (
                        <Text style={styles.customerName}>Customer: {booking.user.name}</Text>
                    )}
                </View>
                <RatingForm type={type} onSubmit={handleSubmit} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
    backButton: { color: colors.primary[500], fontSize: typography.fontSize.md, fontWeight: '500' },
    headerTitle: { fontSize: typography.fontSize.lg, fontWeight: '600', color: colors.text.primary },
    bookingInfo: { padding: spacing.lg, backgroundColor: colors.neutral[50], marginBottom: spacing.md },
    vehicleName: { fontSize: typography.fontSize.md, fontWeight: '600', color: colors.text.primary },
    bookingDates: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs },
    customerName: { fontSize: typography.fontSize.sm, color: colors.primary[500], marginTop: spacing.sm },
});

export default RatingScreen;

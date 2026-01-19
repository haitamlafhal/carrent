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
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { VehicleCard, Button } from '../../components';
import { useAuthStore } from '../../stores';
import { getAgencies, getVehiclesByAgency, updateVehicle, deleteVehicle } from '../../services/databaseService';
import { Agency, Vehicle } from '../../types';

const FleetScreen = ({ navigation }: any) => {
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'rented'>('all');

    // Real State
    const [agency, setAgency] = useState<Agency | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const fetchData = async () => {
        try {
            const allAgencies = await getAgencies();
            const myAgency = allAgencies.find(a => a.name === user?.agencyName);
            setAgency(myAgency || null);

            if (myAgency) {
                const agencyVehicles = await getVehiclesByAgency(myAgency.id);
                setVehicles(agencyVehicles);
            } else {
                setVehicles([]);
            }
        } catch (error) {
            console.error('Error fetching fleet:', error);
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

    const getFilteredVehicles = () => {
        switch (activeFilter) {
            case 'available':
                return vehicles.filter((v) => v.isAvailable);
            case 'rented':
                return vehicles.filter((v) => !v.isAvailable);
            default:
                return vehicles;
        }
    };

    const filteredVehicles = getFilteredVehicles();
    const availableCount = vehicles.filter((v) => v.isAvailable).length;
    const rentedCount = vehicles.filter((v) => !v.isAvailable).length;

    const FilterChip = ({
        label,
        count,
        active,
        onPress,
    }: {
        label: string;
        count: number;
        active: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.filterChip, active && styles.filterChipActive]}
            onPress={onPress}
        >
            <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {label}
            </Text>
            <View style={[styles.filterChipCount, active && styles.filterChipCountActive]}>
                <Text style={[styles.filterChipCountText, active && styles.filterChipCountTextActive]}>
                    {count}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Loading Fleet...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!agency) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No Agency Found</Text>
                    <Button title="Refresh" onPress={fetchData} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Fleet Management</Text>
                    <Text style={styles.headerSubtitle}>{vehicles.length} vehicles total</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddVehicle', { agencyId: agency?.id })}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <FilterChip
                    label="All"
                    count={vehicles.length}
                    active={activeFilter === 'all'}
                    onPress={() => setActiveFilter('all')}
                />
                <FilterChip
                    label="Available"
                    count={availableCount}
                    active={activeFilter === 'available'}
                    onPress={() => setActiveFilter('available')}
                />
                <FilterChip
                    label="Rented"
                    count={rentedCount}
                    active={activeFilter === 'rented'}
                    onPress={() => setActiveFilter('rented')}
                />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                        <View key={vehicle.id} style={styles.vehicleContainer}>
                            <VehicleCard
                                vehicle={vehicle}
                                onPress={() => navigation.navigate('AddVehicle', { vehicle, agencyId: agency?.id })}
                            />
                            <View style={styles.vehicleActions}>
                                <TouchableOpacity
                                    style={styles.vehicleActionButton}
                                    onPress={() => navigation.navigate('AddVehicle', { vehicle, agencyId: agency?.id })}
                                >
                                    <Text style={styles.actionButtonIcon}>✏️</Text>
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.vehicleActionButton,
                                        vehicle.isAvailable ? styles.pauseButton : styles.activateButton,
                                    ]}
                                    onPress={async () => {
                                        try {
                                            await updateVehicle(vehicle.id, { isAvailable: !vehicle.isAvailable });
                                            // Refresh local list optimistically or refetch
                                            fetchData();
                                        } catch (error) {
                                            console.error("Failed to update status", error);
                                        }
                                    }}
                                >
                                    <Text style={styles.actionButtonIcon}>
                                        {vehicle.isAvailable ? '⏸️' : '▶️'}
                                    </Text>
                                    <Text style={styles.actionButtonText}>
                                        {vehicle.isAvailable ? 'Pause' : 'Activate'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.vehicleActionButton, styles.deleteButton]}
                                    onPress={() => {
                                        Alert.alert(
                                            "Confirm Delete",
                                            "Are you sure you want to delete this vehicle?",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                {
                                                    text: "Delete",
                                                    style: "destructive",
                                                    onPress: async () => {
                                                        try {
                                                            await deleteVehicle(vehicle.id);
                                                            fetchData();
                                                        } catch (error) {
                                                            console.error("Failed to delete", error);
                                                        }
                                                    }
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <Text style={styles.actionButtonIcon}>🗑️</Text>
                                    <Text style={[styles.actionButtonText, styles.deleteText]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🚗</Text>
                        <Text style={styles.emptyTitle}>No vehicles found</Text>
                        <Text style={styles.emptySubtitle}>
                            {activeFilter === 'all'
                                ? 'Add your first vehicle to get started'
                                : `No ${activeFilter} vehicles at the moment`}
                        </Text>
                        {activeFilter === 'all' && (
                            <Button
                                title="Add Vehicle"
                                onPress={() => navigation.navigate('AddVehicle', { agencyId: agency?.id })}
                                style={styles.addVehicleButton}
                            />
                        )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.background.primary,
    },
    headerTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
        color: colors.text.primary,
    },
    headerSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    addButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    addButtonText: {
        color: colors.text.inverse,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
    },
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
        gap: spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral[100],
    },
    filterChipActive: {
        backgroundColor: colors.primary[500],
    },
    filterChipText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    filterChipTextActive: {
        color: colors.text.inverse,
    },
    filterChipCount: {
        marginLeft: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral[300],
    },
    filterChipCountActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    filterChipCountText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    filterChipCountTextActive: {
        color: colors.text.inverse,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    vehicleContainer: {
        marginBottom: spacing.lg,
    },
    vehicleActions: {
        flexDirection: 'row',
        marginTop: -spacing.sm,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    vehicleActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutral[100],
    },
    pauseButton: {
        backgroundColor: colors.warning.light,
    },
    activateButton: {
        backgroundColor: colors.success.light,
    },
    deleteButton: {
        backgroundColor: colors.error.light,
    },
    actionButtonIcon: {
        fontSize: typography.fontSize.sm,
        marginRight: spacing.xs,
    },
    actionButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
        color: colors.text.primary,
    },
    deleteText: {
        color: colors.error.dark,
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
    addVehicleButton: {
        minWidth: 150,
    },
});

export default FleetScreen;

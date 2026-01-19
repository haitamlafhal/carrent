import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Button, Input } from '../../components';
import { VehicleCategory, TransmissionType, FuelType } from '../../types';

import { createVehicle, updateVehicle } from '../../services/databaseService';
import { useAuthStore } from '../../stores';

const AddVehicleScreen = ({ navigation, route }: any) => {
    const { agencyId, vehicle } = route.params || {};
    const { user } = useAuthStore();

    // Initialize state with vehicle data if editing
    const [images, setImages] = useState<string[]>(vehicle?.images ? JSON.parse(vehicle.images) : (vehicle?.imageUrl ? [vehicle.imageUrl] : []));
    const [make, setMake] = useState(vehicle?.make || '');
    const [model, setModel] = useState(vehicle?.model || '');
    const [year, setYear] = useState(vehicle?.year?.toString() || '');
    const [category, setCategory] = useState<VehicleCategory>(vehicle?.category || 'compact');
    const [transmission, setTransmission] = useState<TransmissionType>(vehicle?.transmission || 'automatic');
    const [fuelType, setFuelType] = useState<FuelType>(vehicle?.fuelType || 'petrol');
    const [seats, setSeats] = useState(vehicle?.seats?.toString() || '5');
    const [doors, setDoors] = useState(vehicle?.doors?.toString() || '4');
    const [dailyRate, setDailyRate] = useState(vehicle?.pricePerDay?.toString() || '');
    const [deliveryAvailable, setDeliveryAvailable] = useState(false); // assuming false default or need logic
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(vehicle?.features ? JSON.parse(vehicle.features) : []);
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!vehicle;

    const categories: VehicleCategory[] = ['economy', 'compact', 'suv', 'luxury', 'van', 'sports'];
    const features = ['AC', 'Bluetooth', 'USB', 'GPS', 'Backup Camera', 'Leather Seats', 'Sunroof'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });
        if (!result.canceled) {
            setImages((prev) => [...prev, result.assets[0].uri].slice(0, 10));
        }
    };

    const toggleFeature = (feature: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
        );
    };

    const handleSubmit = async () => {
        if (!make || !model || !dailyRate) {
            Alert.alert('Missing Info', 'Please fill required fields (Make, Model, Rate)');
            return;
        }

        if (!agencyId && !isEditing) {
            Alert.alert('Error', 'Agency ID missing. Please go back and try again.');
            return;
        }

        setIsLoading(true);
        try {
            const vehicleData = {
                agencyId: agencyId || vehicle.agencyId,
                make,
                model,
                year,
                category,
                pricePerDay: dailyRate,
                imageUrl: images[0] || '',
                images,
                transmission,
                fuelType,
                seats,
                features: selectedFeatures,
            };

            if (isEditing) {
                await updateVehicle(vehicle.id, vehicleData);
                Alert.alert('Success', 'Vehicle updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createVehicle(vehicleData);
                Alert.alert('Success', 'Vehicle added successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate back and potentially trigger refresh logic if needed
                            // (FleetScreen onRefresh or useEffect dependency)
                            navigation.goBack();
                        }
                    }
                ]);
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            Alert.alert('Error', 'Failed to save vehicle. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Photos</Text>
                    <ScrollView horizontal>
                        <TouchableOpacity style={styles.addImg} onPress={pickImage}>
                            <Text>📷 Add</Text>
                        </TouchableOpacity>
                        {images.map((uri, i) => (
                            <Image key={i} source={{ uri }} style={styles.img} />
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.section}>
                    <Input label="Make *" value={make} onChangeText={setMake} placeholder="Toyota" />
                    <Input label="Model *" value={model} onChangeText={setModel} placeholder="Corolla" />
                    <Input label="Year" value={year} onChangeText={setYear} placeholder="2024" keyboardType="numeric" />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.chips}>
                        {categories.map((c) => (
                            <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                                <Text style={category === c ? styles.chipTextActive : styles.chipText}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Features</Text>
                    <View style={styles.chips}>
                        {features.map((f) => (
                            <TouchableOpacity key={f} style={[styles.chip, selectedFeatures.includes(f) && styles.chipActive]} onPress={() => toggleFeature(f)}>
                                <Text style={selectedFeatures.includes(f) ? styles.chipTextActive : styles.chipText}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Input label="Daily Rate ($) *" value={dailyRate} onChangeText={setDailyRate} placeholder="45" keyboardType="numeric" />
                </View>
                <View style={styles.submitBtn}>
                    <Button title={isEditing ? 'Update Vehicle' : 'Add Vehicle'} onPress={handleSubmit} loading={isLoading} fullWidth size="lg" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, backgroundColor: colors.background.primary },
    backBtn: { color: colors.primary[500], fontSize: typography.fontSize.md },
    title: { fontSize: typography.fontSize.lg, fontWeight: '600', color: colors.text.primary },
    content: { flex: 1 },
    section: { backgroundColor: colors.background.primary, padding: spacing.lg, marginBottom: spacing.sm },
    label: { fontSize: typography.fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md },
    addImg: { width: 80, height: 80, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.neutral[300], borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    img: { width: 80, height: 80, borderRadius: borderRadius.md, marginRight: spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.neutral[100] },
    chipActive: { backgroundColor: colors.primary[100], borderWidth: 1, borderColor: colors.primary[500] },
    chipText: { fontSize: typography.fontSize.sm, color: colors.text.secondary, textTransform: 'capitalize' },
    chipTextActive: { fontSize: typography.fontSize.sm, color: colors.primary[600], textTransform: 'capitalize' },
    submitBtn: { padding: spacing.lg, backgroundColor: colors.background.primary, marginBottom: spacing['2xl'] },
});

export default AddVehicleScreen;

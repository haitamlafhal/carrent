import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Button } from '../../components';
import { useAuthStore } from '../../stores';
import { getAgencies } from '../../services/databaseService';
import { Agency } from '../../types';

const ProfileScreen = ({ navigation }: any) => {
    const { user, logout } = useAuthStore();
    const [agency, setAgency] = useState<Agency | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAgency = async () => {
        try {
            const allAgencies = await getAgencies();
            const myAgency = allAgencies.find(a => a.name === user?.agencyName);
            setAgency(myAgency || null);
        } catch (error) {
            console.error('Error fetching agency profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgency();
    }, [user]);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => logout() },
        ]);
    };

    const handleMenuPress = (title: string) => {
        Alert.alert(title, 'This feature is coming soon!', [{ text: 'OK' }]);
    };

    const menuItems = [
        { icon: '🏢', title: 'Agency Profile', subtitle: 'Update business information' },
        { icon: '⏰', title: 'Operating Hours', subtitle: 'Set your availability' },
        { icon: '💳', title: 'Payment Settings', subtitle: 'Manage payout methods' },
        { icon: '🔔', title: 'Notifications', subtitle: 'Configure alerts' },
        { icon: '📊', title: 'Analytics', subtitle: 'View detailed reports' },
        { icon: '❓', title: 'Help & Support', subtitle: 'Get assistance' },
    ];

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
                <View style={styles.container}>
                    <View style={styles.header}><Text style={styles.headerTitle}>Settings</Text></View>
                    <View style={{ padding: spacing.xl, alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', color: colors.text.secondary, marginBottom: spacing.lg }}>
                            No agency profile found for {user?.agencyName}.
                        </Text>
                        <Button title="Logout" onPress={handleLogout} variant="outline" />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Settings</Text></View>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        {agency.logoUrl ? <Image source={{ uri: agency.logoUrl }} style={styles.avatarImg} /> : <Text style={styles.avatarText}>{agency.name.charAt(0)}</Text>}
                    </View>
                    <Text style={styles.agencyName}>{agency.name}</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>✓ Verified</Text></View>
                    <View style={styles.stats}>
                        <View style={styles.stat}><Text style={styles.statVal}>{agency.totalReviews || 0}</Text><Text style={styles.statLbl}>Reviews</Text></View>
                        <View style={styles.divider} />
                        <View style={styles.stat}><Text style={styles.statVal}>{(agency.rating || 0).toFixed(1)}</Text><Text style={styles.statLbl}>Rating</Text></View>
                    </View>
                </View>
                <View style={styles.menu}>
                    {menuItems.map((item, i) => (
                        <TouchableOpacity key={i} style={styles.menuItem} onPress={() => handleMenuPress(item.title)}>
                            <View style={styles.menuIcon}><Text>{item.icon}</Text></View>
                            <View style={styles.menuInfo}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSub}>{item.subtitle}</Text></View>
                            <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.logoutBox}><Button title="Logout" onPress={handleLogout} variant="outline" fullWidth /></View>
                <Text style={styles.version}>CarRental Manager v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: { padding: spacing.lg, backgroundColor: colors.background.primary },
    headerTitle: { fontSize: typography.fontSize['2xl'], fontWeight: '700', color: colors.text.primary },
    profileCard: { backgroundColor: colors.background.primary, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary[500], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, overflow: 'hidden' },
    avatarImg: { width: '100%', height: '100%' },
    avatarText: { fontSize: 32, fontWeight: '700', color: colors.text.inverse },
    agencyName: { fontSize: typography.fontSize.xl, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
    badge: { backgroundColor: colors.success.light, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginBottom: spacing.lg },
    badgeText: { fontSize: typography.fontSize.sm, color: colors.success.dark, fontWeight: '500' },
    stats: { flexDirection: 'row', alignItems: 'center' },
    stat: { alignItems: 'center', paddingHorizontal: spacing.xl },
    statVal: { fontSize: typography.fontSize.xl, fontWeight: '700', color: colors.primary[500] },
    statLbl: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs },
    divider: { width: 1, height: 40, backgroundColor: colors.neutral[200] },
    menu: { backgroundColor: colors.background.primary, marginBottom: spacing.md },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
    menuIcon: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    menuInfo: { flex: 1 },
    menuTitle: { fontSize: typography.fontSize.base, fontWeight: '500', color: colors.text.primary },
    menuSub: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 2 },
    arrow: { fontSize: typography.fontSize.md, color: colors.neutral[400] },
    logoutBox: { padding: spacing.lg, backgroundColor: colors.background.primary, marginBottom: spacing.md },
    version: { textAlign: 'center', fontSize: typography.fontSize.xs, color: colors.text.tertiary, paddingVertical: spacing.lg },
});

export default ProfileScreen;

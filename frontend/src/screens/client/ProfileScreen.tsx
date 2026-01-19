import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { Button } from '../../components';
import { useAuthStore } from '../../stores';

const ProfileScreen = ({ navigation }: any) => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => logout() },
            ]
        );
    };

    const handleMenuPress = (title: string) => {
        Alert.alert(title, 'This feature is coming soon!', [{ text: 'OK' }]);
    };

    const menuItems = [
        { icon: '👤', title: 'Edit Profile', subtitle: 'Update your personal information' },
        { icon: '📄', title: "Driver's License", subtitle: 'Manage license verification' },
        { icon: '💳', title: 'Payment Methods', subtitle: 'Add or remove payment options' },
        { icon: '📍', title: 'Saved Addresses', subtitle: 'Manage delivery locations' },
        { icon: '🔔', title: 'Notifications', subtitle: 'Customize notification preferences' },
        { icon: '🔒', title: 'Privacy & Security', subtitle: 'Password and security settings' },
        { icon: '❓', title: 'Help & Support', subtitle: 'FAQ and contact support' },
        { icon: '📜', title: 'Terms & Conditions', subtitle: 'Read our terms of service' },
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Text key={i} style={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</Text>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {user?.profilePhotoUrl ? (
                            <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.editAvatarButton} onPress={() => handleMenuPress('Change Photo')}>
                            <Text style={styles.editAvatarIcon}>📷</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.totalRentals || 0}</Text>
                            <Text style={styles.statLabel}>Rentals</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.ratingContainer}>{renderStars(user?.averageRating || 0)}</View>
                            <Text style={styles.statLabel}>{(user?.averageRating || 0).toFixed(1)} Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statusBadge}>
                                {user?.licenseStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
                            </Text>
                            <Text style={styles.statLabel}>License</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleMenuPress(item.title)}>
                            <View style={styles.menuIconContainer}><Text style={styles.menuIcon}>{item.icon}</Text></View>
                            <View style={styles.menuInfo}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Text style={styles.menuArrow}>→</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.logoutContainer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        fullWidth
                        icon={<Text style={styles.logoutIcon}>🚪</Text>}
                    />
                </View>

                <Text style={styles.version}>CarRental v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, backgroundColor: colors.background.primary },
    headerTitle: { fontSize: typography.fontSize['2xl'], fontWeight: '700', color: colors.text.primary },
    profileCard: { backgroundColor: colors.background.primary, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
    avatarContainer: { position: 'relative', marginBottom: spacing.md },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary[500], alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 40, fontWeight: '700', color: colors.text.inverse },
    editAvatarButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background.primary, alignItems: 'center', justifyContent: 'center', ...shadows.md },
    editAvatarIcon: { fontSize: 16 },
    userName: { fontSize: typography.fontSize.xl, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    userEmail: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.lg },
    statsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.neutral[100] },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: typography.fontSize.xl, fontWeight: '700', color: colors.primary[500] },
    statLabel: { fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: spacing.xs },
    statDivider: { width: 1, height: 40, backgroundColor: colors.neutral[200] },
    ratingContainer: { flexDirection: 'row' },
    starFilled: { color: colors.secondary[500], fontSize: typography.fontSize.sm },
    starEmpty: { color: colors.neutral[300], fontSize: typography.fontSize.sm },
    statusBadge: { fontSize: typography.fontSize.sm, fontWeight: '600', color: colors.success.main },
    menuContainer: { backgroundColor: colors.background.primary, marginBottom: spacing.md },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.base, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
    menuIconContainer: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    menuIcon: { fontSize: 20 },
    menuInfo: { flex: 1 },
    menuTitle: { fontSize: typography.fontSize.base, fontWeight: '500', color: colors.text.primary },
    menuSubtitle: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 2 },
    menuArrow: { fontSize: typography.fontSize.md, color: colors.neutral[400] },
    logoutContainer: { padding: spacing.lg, backgroundColor: colors.background.primary, marginBottom: spacing.md },
    logoutIcon: { fontSize: typography.fontSize.md, marginRight: spacing.sm },
    version: { textAlign: 'center', fontSize: typography.fontSize.xs, color: colors.text.tertiary, paddingVertical: spacing.lg },
});

export default ProfileScreen;

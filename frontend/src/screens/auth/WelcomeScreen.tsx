import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backgroundDecoration}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.logoEmoji}>🚗</Text>
                    <Text style={styles.logoText}>CarRental</Text>
                    <Text style={styles.tagline}>Your journey starts here</Text>
                </View>

                <View style={styles.illustration}>
                    <View style={styles.carContainer}>
                        <Text style={styles.carEmoji}>🚙</Text>
                        <View style={styles.road} />
                    </View>
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📍</Text>
                            <Text style={styles.featureText}>Find nearby agencies</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>⚡</Text>
                            <Text style={styles.featureText}>Quick booking</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🚚</Text>
                            <Text style={styles.featureText}>Delivery available</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>⭐</Text>
                            <Text style={styles.featureText}>Trusted reviews</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <Text style={styles.selectTypeText}>Choose your account type</Text>

                    <TouchableOpacity
                        style={styles.typeCard}
                        onPress={() => navigation.navigate('Login', { userType: 'client' })}
                        activeOpacity={0.9}
                    >
                        <View style={styles.typeIconContainer}>
                            <Text style={styles.typeIcon}>👤</Text>
                        </View>
                        <View style={styles.typeInfo}>
                            <Text style={styles.typeTitle}>I'm a Customer</Text>
                            <Text style={styles.typeDescription}>
                                Rent cars from verified agencies near you
                            </Text>
                        </View>
                        <Text style={styles.typeArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.typeCard}
                        onPress={() => navigation.navigate('Login', { userType: 'manager' })}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.typeIconContainer, styles.managerIcon]}>
                            <Text style={styles.typeIcon}>🏢</Text>
                        </View>
                        <View style={styles.typeInfo}>
                            <Text style={styles.typeTitle}>I'm an Agency Manager</Text>
                            <Text style={styles.typeDescription}>
                                Manage your fleet and rental requests
                            </Text>
                        </View>
                        <Text style={styles.typeArrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    backgroundDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    circle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: colors.primary[500],
        opacity: 0.1,
    },
    circle2: {
        position: 'absolute',
        top: height * 0.3,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: colors.secondary[500],
        opacity: 0.05,
    },
    circle3: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.primary[400],
        opacity: 0.1,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    logoEmoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    logoText: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: '700',
        color: colors.text.inverse,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: typography.fontSize.md,
        color: colors.neutral[400],
    },
    illustration: {
        alignItems: 'center',
        marginVertical: spacing['2xl'],
    },
    carContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    carEmoji: {
        fontSize: 80,
    },
    road: {
        width: 200,
        height: 3,
        backgroundColor: colors.neutral[600],
        borderRadius: 2,
        marginTop: spacing.sm,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    featureIcon: {
        fontSize: typography.fontSize.base,
        marginRight: spacing.xs,
    },
    featureText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutral[300],
    },
    buttonsContainer: {
        marginBottom: spacing.xl,
    },
    selectTypeText: {
        fontSize: typography.fontSize.md,
        color: colors.neutral[400],
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    typeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    typeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    managerIcon: {
        backgroundColor: colors.secondary[500],
    },
    typeIcon: {
        fontSize: 24,
    },
    typeInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    typeTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text.inverse,
        marginBottom: spacing.xs,
    },
    typeDescription: {
        fontSize: typography.fontSize.sm,
        color: colors.neutral[400],
    },
    typeArrow: {
        fontSize: typography.fontSize.xl,
        color: colors.neutral[400],
    },
});

export default WelcomeScreen;

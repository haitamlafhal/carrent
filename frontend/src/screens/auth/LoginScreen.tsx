import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button, Input } from '../../components';
import { useAuthStore } from '../../stores';
import { loginWithEmail } from '../../services/authService';
import { mockUsers } from '../../data/mockData';

const LoginScreen = ({ navigation, route }: any) => {
    const userType = route.params?.userType || 'client';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser, setUserType } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setIsLoading(true);
        try {
            const user = await loginWithEmail(email, password);
            setUser(user);
            setUserType(user.userType || userType);
            Alert.alert('Success', `Welcome back ${user.name}!`);
        } catch (error: any) {
            console.error('Login error:', error);
            let message = 'Failed to sign in';
            if (error.code === 'auth/user-not-found') message = 'No account found with this email';
            else if (error.code === 'auth/wrong-password') message = 'Incorrect password';
            else if (error.code === 'auth/invalid-email') message = 'Invalid email address';
            else if (error.code === 'auth/invalid-credential') message = 'Invalid email or password';

            // Fallback for generic errors
            if (!error.code && error.message) message = error.message;

            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = () => {
        // For local dev, we can just login with mock users directly if they exist in DB, 
        // or just set state if we authorized that bypass. 
        // But since we have a real DB now, let's auto-fill fields or bypass.
        // Let's just bypass for true "Demo" feel without typing.
        const mockUser = userType === 'client' ? mockUsers[0] : mockUsers[2];
        setUser({ ...mockUser, userType });
        setUserType(userType);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={[styles.iconContainer, userType === 'manager' && styles.managerIconBg]}>
                            <Text style={styles.icon}>{userType === 'client' ? '👤' : '🏢'}</Text>
                        </View>
                        <Text style={styles.title}>{userType === 'client' ? 'Welcome Back!' : 'Agency Login'}</Text>
                        <Text style={styles.subtitle}>
                            {userType === 'client' ? 'Sign in to continue renting cars' : 'Sign in to manage your fleet'}
                        </Text>
                        <Text style={styles.localModeTag}>[Local SQLite Mode]</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                        />
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <Button title="Sign In" onPress={handleLogin} loading={isLoading} fullWidth size="lg" />

                        <View style={styles.orDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <Button title="Demo Account (Bypass)" onPress={handleDemoLogin} variant="outline" fullWidth size="lg" />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register', { userType })}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: spacing.xl },
    backButton: { marginBottom: spacing.xl },
    backButtonText: { fontSize: typography.fontSize.md, color: colors.primary[500], fontWeight: '500' },
    header: { alignItems: 'center', marginBottom: spacing.xl },
    iconContainer: { width: 80, height: 80, borderRadius: borderRadius.xl, backgroundColor: colors.primary[100], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
    managerIconBg: { backgroundColor: colors.secondary[100] },
    icon: { fontSize: 40 },
    title: { fontSize: typography.fontSize['2xl'], fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
    subtitle: { fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: 'center' },
    localModeTag: { marginTop: spacing.sm, color: colors.primary[500], fontSize: typography.fontSize.xs, fontWeight: 'bold' },
    form: { marginBottom: spacing.xl },
    inputIcon: { fontSize: typography.fontSize.md },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: spacing.lg },
    forgotPasswordText: { fontSize: typography.fontSize.sm, color: colors.primary[500], fontWeight: '500' },
    orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.neutral[200] },
    dividerText: { marginHorizontal: spacing.md, color: colors.text.tertiary, fontSize: typography.fontSize.sm },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: spacing.xl },
    footerText: { fontSize: typography.fontSize.base, color: colors.text.secondary },
    footerLink: { fontSize: typography.fontSize.base, color: colors.primary[500], fontWeight: '600' },
});

export default LoginScreen;

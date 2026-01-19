import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button, Input } from '../../components';
import { useAuthStore } from '../../stores';
import { registerWithEmail } from '../../services/authService';

const RegisterScreen = ({ navigation, route }: any) => {
    const userType = route.params?.userType || 'client';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { setUser, setUserType } = useAuthStore();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        if (!termsAccepted) {
            Alert.alert('Error', 'Please accept the Terms of Service');
            return;
        }

        setIsLoading(true);
        try {
            const user = await registerWithEmail(email, password, name, userType, agencyName);
            setUser(user);
            setUserType(userType);
            Alert.alert('Success', 'Account created successfully!');
        } catch (error: any) {
            console.error('Registration error:', error);
            let message = 'Failed to create account';
            if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
            else if (error.code === 'auth/weak-password') message = 'Password is too weak';
            else if (error.code === 'auth/invalid-email') message = 'Invalid email address';

            // Fallback
            if (!error.code && error.message) message = error.message;

            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            {userType === 'client' ? 'Join thousands of happy renters' : 'Start managing your rental fleet'}
                        </Text>
                        <Text style={styles.localModeTag}>[Local SQLite Mode]</Text>
                    </View>

                    <View style={styles.form}>
                        {userType === 'manager' && (
                            <Input label="Agency Name" placeholder="Enter your agency name" value={agencyName} onChangeText={setAgencyName} leftIcon={<Text style={styles.inputIcon}>🏢</Text>} />
                        )}
                        <Input label="Full Name *" placeholder="Enter your full name" value={name} onChangeText={setName} leftIcon={<Text style={styles.inputIcon}>👤</Text>} />
                        <Input label="Email *" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" leftIcon={<Text style={styles.inputIcon}>✉️</Text>} />
                        <Input label="Phone Number" placeholder="+212 600 000 000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" leftIcon={<Text style={styles.inputIcon}>📱</Text>} />
                        <Input label="Password *" placeholder="Create a password (min 6 chars)" value={password} onChangeText={setPassword} secureTextEntry leftIcon={<Text style={styles.inputIcon}>🔒</Text>} />
                        <Input label="Confirm Password *" placeholder="Confirm your password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry leftIcon={<Text style={styles.inputIcon}>🔒</Text>} />

                        <TouchableOpacity style={styles.termsContainer} onPress={() => setTermsAccepted(!termsAccepted)}>
                            <Text style={styles.checkbox}>{termsAccepted ? '☑️' : '☐'}</Text>
                            <Text style={styles.termsText}>
                                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>

                        <Button title="Create Account" onPress={handleRegister} loading={isLoading} fullWidth size="lg" />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login', { userType })}>
                            <Text style={styles.footerLink}>Sign In</Text>
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
    backButton: { marginBottom: spacing.lg },
    backButtonText: { fontSize: typography.fontSize.md, color: colors.primary[500], fontWeight: '500' },
    header: { marginBottom: spacing.xl },
    title: { fontSize: typography.fontSize['2xl'], fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
    subtitle: { fontSize: typography.fontSize.base, color: colors.text.secondary },
    localModeTag: { marginTop: spacing.sm, color: colors.primary[500], fontSize: typography.fontSize.xs, fontWeight: 'bold' },
    form: { marginBottom: spacing.xl },
    inputIcon: { fontSize: typography.fontSize.md },
    termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
    checkbox: { fontSize: typography.fontSize.lg, marginRight: spacing.sm },
    termsText: { flex: 1, fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
    termsLink: { color: colors.primary[500], fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: spacing.xl },
    footerText: { fontSize: typography.fontSize.base, color: colors.text.secondary },
    footerLink: { fontSize: typography.fontSize.base, color: colors.primary[500], fontWeight: '600' },
});

export default RegisterScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useAuthStore } from '../stores';

// Client Screens
import ClientHomeScreen from '../screens/client/HomeScreen';
import AgencyDetailsScreen from '../screens/client/AgencyDetailsScreen';
import VehicleDetailsScreen from '../screens/client/VehicleDetailsScreen';
import BookingScreen from '../screens/client/BookingScreen';
import ClientBookingsScreen from '../screens/client/BookingsScreen';
import ClientProfileScreen from '../screens/client/ProfileScreen';

// Manager Screens
import ManagerDashboardScreen from '../screens/manager/DashboardScreen';
import ManagerBookingsScreen from '../screens/manager/BookingsScreen';
import FleetScreen from '../screens/manager/FleetScreen';
import AddVehicleScreen from '../screens/manager/AddVehicleScreen';
import ManagerProfileScreen from '../screens/manager/ProfileScreen';

// Shared Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RatingScreen from '../screens/shared/RatingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const icons: Record<string, string> = {
        Home: '🏠',
        Explore: '🔍',
        Bookings: '📋',
        Profile: '👤',
        Dashboard: '📊',
        Fleet: '🚗',
        Requests: '📬',
    };

    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                {icons[name] || '📱'}
            </Text>
            {focused && <View style={styles.tabIndicator} />}
        </View>
    );
};

// Client Tab Navigator
const ClientTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.neutral[400],
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
            })}
        >
            <Tab.Screen name="Home" component={ClientHomeScreen} />
            <Tab.Screen name="Bookings" component={ClientBookingsScreen} />
            <Tab.Screen name="Profile" component={ClientProfileScreen} />
        </Tab.Navigator>
    );
};

// Manager Tab Navigator
const ManagerTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.neutral[400],
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
            })}
        >
            <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} />
            <Tab.Screen name="Requests" component={ManagerBookingsScreen} />
            <Tab.Screen name="Fleet" component={FleetScreen} />
            <Tab.Screen name="Profile" component={ManagerProfileScreen} />
        </Tab.Navigator>
    );
};

// Main App Navigator
const AppNavigator = () => {
    const { isAuthenticated, userType } = useAuthStore();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!isAuthenticated ? (
                    // Auth Stack
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : userType === 'client' ? (
                    // Client Stack
                    <>
                        <Stack.Screen name="ClientMain" component={ClientTabNavigator} />
                        <Stack.Screen name="AgencyDetails" component={AgencyDetailsScreen} />
                        <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
                        <Stack.Screen name="Booking" component={BookingScreen} />
                        <Stack.Screen name="Rating" component={RatingScreen} />
                    </>
                ) : (
                    // Manager Stack
                    <>
                        <Stack.Screen name="ManagerMain" component={ManagerTabNavigator} />
                        <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
                        <Stack.Screen name="Rating" component={RatingScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
        paddingTop: 8,
        paddingBottom: 8,
        height: 70,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    tabIconContainer: {
        alignItems: 'center',
    },
    tabIcon: {
        fontSize: 24,
    },
    tabIconFocused: {
        transform: [{ scale: 1.1 }],
    },
    tabIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary[500],
        marginTop: 4,
    },
});

export default AppNavigator;

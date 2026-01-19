// Color Palette
export const colors = {
    // Primary Colors
    primary: {
        50: '#E8F5FF',
        100: '#D1EBFF',
        200: '#A3D7FF',
        300: '#75C3FF',
        400: '#47AFFF',
        500: '#0095FF', // Main brand color
        600: '#0077CC',
        700: '#005999',
        800: '#003B66',
        900: '#001D33',
    },

    // Secondary Colors (Orange/Amber)
    secondary: {
        50: '#FFF8E6',
        100: '#FFF1CC',
        200: '#FFE399',
        300: '#FFD566',
        400: '#FFC733',
        500: '#FFB800', // Accent color
        600: '#CC9300',
        700: '#996E00',
        800: '#664A00',
        900: '#332500',
    },

    // Neutral Colors
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Semantic Colors
    success: {
        light: '#D1FAE5',
        main: '#10B981',
        dark: '#065F46',
    },
    warning: {
        light: '#FEF3C7',
        main: '#F59E0B',
        dark: '#92400E',
    },
    error: {
        light: '#FEE2E2',
        main: '#EF4444',
        dark: '#991B1B',
    },
    info: {
        light: '#DBEAFE',
        main: '#3B82F6',
        dark: '#1E40AF',
    },

    // Background Colors
    background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
        dark: '#1A1A2E',
        darkSecondary: '#16213E',
    },

    // Text Colors
    text: {
        primary: '#111827',
        secondary: '#4B5563',
        tertiary: '#9CA3AF',
        inverse: '#FFFFFF',
    },

    // Status Colors for Bookings
    status: {
        pending: '#F59E0B',
        confirmed: '#10B981',
        inProgress: '#3B82F6',
        completed: '#6B7280',
        cancelled: '#EF4444',
        rejected: '#DC2626',
    },
};

// Typography
export const typography = {
    fontFamily: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
    },
    fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Spacing
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
};

// Border Radius
export const borderRadius = {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
};

// Shadows
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
    },
};

// Export theme object
export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};

export default theme;

export const theme = {
    colors: {
        primary: '#10b981', // Emerald 500
        primaryDark: '#059669', // Emerald 600
        primaryLight: '#ecfdf5', // Emerald 50
        secondary: '#3b82f6', // Blue 500
        background: '#f8fafc', // Slate 50
        card: '#ffffff',
        text: '#1e293b', // Slate 800
        textSecondary: '#64748b', // Slate 500
        border: '#e2e8f0', // Slate 200
        error: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 40,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        full: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        large: {
            shadowColor: '#10b981', // Colored shadow for primary interactive elements
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 10,
        },
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '800' as '800', lineHeight: 34 },
        h2: { fontSize: 24, fontWeight: '700' as '700', lineHeight: 30 },
        h3: { fontSize: 20, fontWeight: '700' as '700', lineHeight: 26 },
        body: { fontSize: 16, fontWeight: '400' as '400', lineHeight: 24 },
        caption: { fontSize: 12, fontWeight: '500' as '500', lineHeight: 16 },
        button: { fontSize: 16, fontWeight: '600' as '600', letterSpacing: 0.5 },
    }
};

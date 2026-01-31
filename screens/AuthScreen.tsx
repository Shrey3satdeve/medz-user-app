import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Pill, ArrowRight, Mail, Lock, User } from '../components/Icons';
import { theme } from '../src/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAppContext } from '../AppContext';
import { ActivityIndicator } from 'react-native';

GoogleSignin.configure({
    webClientId: '1039562913389-tftbnmk02i9uvts3qiku4s5qkbdbcb44.apps.googleusercontent.com',
});

interface AuthScreenProps {
    onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast, setUser } = useAppContext();

    const onGoogleButtonPress = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Sign out first to force account picker every time
            await GoogleSignin.signOut();

            const response = await GoogleSignin.signIn();
            const idToken = (response as any).data?.idToken ?? (response as any).idToken;

            if (!idToken) throw new Error('No ID token found');

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);

            const currentUser = auth().currentUser;
            if (currentUser) {
                // Check if user exists in Firestore
                const userDoc = await firestore().collection('users').doc(currentUser.uid).get();

                if (!userDoc.exists) {
                    // Create new user profile from Google data
                    await firestore().collection('users').doc(currentUser.uid).set({
                        name: currentUser.displayName || 'User',
                        email: currentUser.email,
                        avatarUrl: currentUser.photoURL,
                        age: '',
                        weight: '',
                        height: '',
                        bloodGroup: '',
                        gender: '',
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    });
                }

                // Update Context with merged data (auth + firestore) -> handled by App/Context sync ideally, 
                // but setting here for immediate feedback
                setUser({
                    uid: currentUser.uid,
                    name: currentUser.displayName || 'User',
                    email: currentUser.email,
                    avatarUrl: currentUser.photoURL,
                });
            }

            showToast('Signed in with Google', 'success');
            onLogin();
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            let message = 'Google Sign-In failed';

            if (error.code === 'DEVELOPER_ERROR') {
                message = 'Developer Error: check webClientId/SHA-1';
            } else if (error.code === 'SIGN_IN_CANCELLED') {
                message = 'Sign-In cancelled';
            }

            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        if (!isLogin && !name) {
            showToast('Please enter your name', 'error');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                await auth().signInWithEmailAndPassword(email, password);
                showToast('Welcome back!', 'success');
            } else {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                const uid = userCredential.user.uid;

                // Update Auth Profile
                await auth().currentUser?.updateProfile({ displayName: name });

                // Create Firestore Profile
                await firestore().collection('users').doc(uid).set({
                    name: name,
                    email: email,
                    age: '',
                    weight: '',
                    height: '',
                    bloodGroup: '',
                    gender: '',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

                showToast('Account created successfully!', 'success');
            }

            const currentUser = auth().currentUser;
            setUser({
                uid: currentUser?.uid,
                name: currentUser?.displayName || name || 'User',
                email: currentUser?.email,
                avatarUrl: currentUser?.photoURL,
            });

            onLogin();
        } catch (error: any) {
            console.error(error);
            let message = 'Authentication failed';
            if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <Pill size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.appName}>Medz</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Sign in to access your health essentials' : 'Join us for fast healthcare delivery'}
                    </Text>

                    {!isLogin && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={[
                                styles.inputBox,
                                focusedInput === 'name' && styles.inputBoxFocused
                            ]}>
                                <User size={20} color={focusedInput === 'name' ? theme.colors.primary : theme.colors.textSecondary} />
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="John Doe"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    style={styles.input}
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[
                            styles.inputBox,
                            focusedInput === 'email' && styles.inputBoxFocused
                        ]}>
                            <Mail size={20} color={focusedInput === 'email' ? theme.colors.primary : theme.colors.textSecondary} />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                placeholderTextColor={theme.colors.textSecondary}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[
                            styles.inputBox,
                            focusedInput === 'password' && styles.inputBoxFocused
                        ]}>
                            <Lock size={20} color={focusedInput === 'password' ? theme.colors.primary : theme.colors.textSecondary} />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={theme.colors.textSecondary}
                                style={styles.input}
                                secureTextEntry
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (!email || !password || loading) && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                                <ArrowRight size={20} color="white" />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginTop: 12 }, loading && styles.buttonDisabled]}
                        onPress={onGoogleButtonPress}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : (
                            <Text style={[styles.buttonText, { color: '#0f172a' }]}>Continue with Google</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Text style={styles.linkText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.primaryLight },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.l },
    header: { alignItems: 'center', marginBottom: theme.spacing.xl },
    logoBadge: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.m,
        ...theme.shadows.medium,
    },
    appName: { ...theme.typography.h1, color: theme.colors.primaryDark, letterSpacing: 1 },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.l,
        ...theme.shadows.large,
    },
    title: { ...theme.typography.h2, color: theme.colors.text, marginBottom: theme.spacing.s },
    subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, fontSize: 14 },
    inputGroup: { marginBottom: theme.spacing.m },
    label: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs, marginLeft: theme.spacing.xs, fontWeight: '600' },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: theme.spacing.m,
        height: 56,
        borderWidth: 1.5,
        borderColor: 'transparent'
    },
    inputBoxFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: '#fff',
    },
    input: { flex: 1, marginLeft: theme.spacing.s, fontSize: 16, color: theme.colors.text, fontWeight: '500' },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: theme.borderRadius.l,
        marginTop: theme.spacing.m,
        gap: theme.spacing.s,
        ...theme.shadows.large,
        shadowColor: theme.colors.primary, // Specific colored shadow
    },
    buttonDisabled: { backgroundColor: theme.colors.textSecondary, shadowOpacity: 0, elevation: 0 },
    buttonText: { ...theme.typography.button, color: '#fff' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.l },
    line: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    orText: { marginHorizontal: theme.spacing.m, fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' },
    switchBtn: { alignItems: 'center', padding: theme.spacing.s },
    switchText: { ...theme.typography.body, fontSize: 14, color: theme.colors.textSecondary },
    linkText: { color: theme.colors.primary, fontWeight: '700' },
});
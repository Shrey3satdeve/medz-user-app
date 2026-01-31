import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Check, ArrowRight, ShoppingBag, Clock, MapPin } from '../components/Icons';
import { theme } from '../src/theme';
import { Tab } from '../types';

interface OrderSuccessScreenProps {
    onNavigate: (tab: Tab) => void;
    onViewOrder?: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ onNavigate, onViewOrder }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Check size={48} color="#fff" />
                </View>

                <Text style={styles.title}>Order Placed Successfully!</Text>
                <Text style={styles.subtitle}>Your order #MEDZ-{Math.floor(Math.random() * 10000)} has been confirmed and will be delivered shortly.</Text>

                <View style={styles.timeline}>
                    <View style={styles.step}>
                        <View style={[styles.stepDot, styles.activeDot]} />
                        <View style={styles.stepLine} />
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Order Confirmed</Text>
                            <Text style={styles.stepTime}>Just now</Text>
                        </View>
                    </View>
                    <View style={styles.step}>
                        <View style={styles.stepDot} />
                        <View style={styles.stepLine} />
                        <View style={styles.stepContent}>
                            <Text style={[styles.stepTitle, styles.pendingText]}>Packing</Text>
                            <Text style={styles.stepTime}>~ 2 mins</Text>
                        </View>
                    </View>
                    <View style={styles.step}>
                        <View style={styles.stepDot} />
                        <View style={styles.stepContent}>
                            <Text style={[styles.stepTitle, styles.pendingText]}>Out for Delivery</Text>
                            <Text style={styles.stepTime}>~ 8 mins</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Clock size={16} color="#64748b" />
                        <Text style={styles.infoText}>Estimated Delivery: 10-15 mins</Text>
                    </View>
                    <View style={[styles.infoRow, { marginTop: 8 }]}>
                        <MapPin size={16} color="#64748b" />
                        <Text style={styles.infoText}>Delivering to Home</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.trackBtn} onPress={() => onNavigate(Tab.TrackOrder)}>
                    <Text style={styles.trackBtnText}>Track Order</Text>
                    <ArrowRight size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.homeBtn} onPress={() => onNavigate(Tab.Home)}>
                    <Text style={styles.homeBtnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, padding: 16, shadowColor: theme.colors.success, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
    title: { fontSize: 24, fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: 12 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 40 },
    timeline: { width: '100%', paddingLeft: 16 },
    step: { flexDirection: 'row', minHeight: 60 },
    stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e2e8f0', marginTop: 6, zIndex: 1 },
    activeDot: { backgroundColor: theme.colors.success, borderWidth: 2, borderColor: '#dcfce7' },
    stepLine: { position: 'absolute', left: 5, top: 18, bottom: -12, width: 2, backgroundColor: '#f1f5f9' },
    stepContent: { marginLeft: 16 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    pendingText: { color: '#94a3b8' },
    stepTime: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    infoCard: { width: '100%', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 32 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoText: { fontSize: 14, color: '#475569', fontWeight: '500' },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    trackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, backgroundColor: '#dcfce7', marginBottom: 12 },
    trackBtnText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700', marginRight: 8 },
    homeBtn: { alignItems: 'center', padding: 16 },
    homeBtnText: { color: '#64748b', fontSize: 16, fontWeight: '600' }
});
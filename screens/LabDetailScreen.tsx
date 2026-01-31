import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Thermometer } from '../components/Icons';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface LabDetailScreenProps {
    onNavigate: (tab: Tab) => void;
}

export const LabDetailScreen: React.FC<LabDetailScreenProps> = ({ onNavigate }) => {
    const { selectedLabPackage, showToast } = useAppContext();

    if (!selectedLabPackage) {
        onNavigate(Tab.LabTests);
        return null;
    }

    const handleBook = () => {
        showToast('Booking initiated');
        // In a real app, this would add to cart or start booking flow
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate(Tab.LabTests)} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Package Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.title}>{selectedLabPackage.title}</Text>
                    <Text style={styles.subtitle}>{selectedLabPackage.testCount} Tests included</Text>
                    
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={16} color="#64748b" />
                            <Text style={styles.metaText}>Report in {selectedLabPackage.reportTime}</Text>
                        </View>
                        {selectedLabPackage.fastingHours ? (
                            <View style={styles.metaItem}>
                                <Thermometer size={16} color="#eab308" />
                                <Text style={styles.metaText}>{selectedLabPackage.fastingHours}h Fasting Required</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tests Included</Text>
                    <View style={styles.testList}>
                        {selectedLabPackage.includesTests.map((test, index) => (
                            <View key={index} style={styles.testItem}>
                                <CheckCircle2 size={16} color="#22c55e" />
                                <Text style={styles.testName}>{test}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why choose us?</Text>
                    <View style={styles.featureRow}>
                        <ShieldCheck size={20} color="#9333ea" />
                        <View>
                            <Text style={styles.featureTitle}>NABL Certified Labs</Text>
                            <Text style={styles.featureDesc}>We partner with top-rated ISO certified labs.</Text>
                        </View>
                    </View>
                    <View style={styles.featureRow}>
                        <CheckCircle2 size={20} color="#9333ea" />
                        <View>
                            <Text style={styles.featureTitle}>Safe Home Collection</Text>
                            <Text style={styles.featureDesc}>Phlebotomist follows strict safety protocols.</Text>
                        </View>
                    </View>
                </View>

                <View style={{height: 100}} />
            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.price}>₹{selectedLabPackage.price}</Text>
                    <Text style={styles.mrp}>₹{selectedLabPackage.mrp}</Text>
                </View>
                <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { marginRight: 16 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    scrollContent: { padding: 16 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    title: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748b', marginBottom: 16 },
    metaRow: { flexDirection: 'row', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 12, color: '#475569', fontWeight: '500' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
    testList: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 12 },
    testItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    testName: { fontSize: 14, color: '#334155' },
    featureRow: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
    featureTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    featureDesc: { fontSize: 12, color: '#64748b' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
    mrp: { fontSize: 14, textDecorationLine: 'line-through', color: '#94a3b8' },
    bookBtn: { backgroundColor: '#9333ea', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
    bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
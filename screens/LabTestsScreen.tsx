import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, ShieldCheck, Clock, CheckCircle2, Star, XCircle } from '../components/Icons';
import { LAB_PACKAGES } from '../constants';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface LabTestsScreenProps {
    onNavigate?: (tab: Tab) => void;
}

export const LabTestsScreen: React.FC<LabTestsScreenProps> = ({ onNavigate }) => {
    const { showToast, setSelectedLabPackage } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPackages = LAB_PACKAGES.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.includesTests.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePressPackage = (pkg: any) => {
        setSelectedLabPackage(pkg);
        onNavigate?.(Tab.LabDetails);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lab Tests</Text>
                <Text style={styles.subtitle}>Certified Labs • Safe Home Collection</Text>
                <View style={styles.searchBox}>
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search packages..."
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.trustRow}>
                    {['NABL Certified', '100% Safe', 'On-Time Reports'].map((txt, i) => (
                        <View key={i} style={styles.trustBadge}>
                            <ShieldCheck size={12} color="#9333ea" />
                            <Text style={styles.trustText}>{txt}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Popular Checkups</Text>

                {filteredPackages.map((pkg) => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => handlePressPackage(pkg)}
                    >
                        {pkg.discountTag && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{pkg.discountTag}</Text>
                            </View>
                        )}
                        <Text style={styles.cardTitle}>{pkg.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaBadge}>
                                <Clock size={12} color="#64748b" />
                                <Text style={styles.metaText}>{pkg.reportTime}</Text>
                            </View>
                            <View style={styles.metaBadge}>
                                <Star size={12} color="#eab308" />
                                <Text style={styles.metaText}>4.8</Text>
                            </View>
                        </View>

                        <View style={styles.testsContainer}>
                            <Text style={styles.includesText}>Includes {pkg.testCount} tests:</Text>
                            <View style={styles.testsList}>
                                {pkg.includesTests.slice(0, 3).map((t, i) => (
                                    <View key={i} style={styles.testItem}>
                                        <CheckCircle2 size={12} color="#22c55e" />
                                        <Text style={styles.testName}>{t}</Text>
                                    </View>
                                ))}
                                <Text style={styles.moreText}>+{pkg.includesTests.length - 3} more</Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <View>
                                <Text style={styles.mrp}>₹{pkg.mrp}</Text>
                                <Text style={styles.price}>₹{pkg.price}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handlePressPackage(pkg)} style={styles.bookBtn}>
                                <Text style={styles.bookBtnText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 20 },
    title: { fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: '#64748b', marginBottom: 16, marginTop: 4 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#e2e8f0' },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#334155' },
    scrollContent: { padding: 16, paddingBottom: 120 },
    trustRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 24, paddingHorizontal: 10, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 16 },
    trustBadge: { flexDirection: 'row', alignItems: 'center' },
    trustText: { fontSize: 11, fontWeight: '600', color: '#64748b', marginLeft: 6 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 16, marginLeft: 4 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
    discountBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#7e22ce', borderTopRightRadius: 24, borderBottomLeftRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    discountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', width: '85%', marginBottom: 16, lineHeight: 24 },
    metaRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    metaBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, borderWidth: 1, borderColor: '#f1f5f9' },
    metaText: { fontSize: 12, color: '#475569', fontWeight: '600' },
    testsContainer: { marginBottom: 20, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 },
    includesText: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 10 },
    testsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    testItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' },
    testName: { fontSize: 12, color: '#475569', fontWeight: '500' },
    moreText: { fontSize: 12, fontWeight: '700', color: '#7e22ce', marginTop: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    mrp: { fontSize: 13, textDecorationLine: 'line-through', color: '#94a3b8', marginBottom: 2 },
    price: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
    bookBtn: { backgroundColor: '#7e22ce', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, shadowColor: '#7e22ce', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
    bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
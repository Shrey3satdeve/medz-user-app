import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, FileText, Download, Check } from '../components/Icons';
import { Tab } from '../types';
import { useAppContext } from '../AppContext';
import firestore from '@react-native-firebase/firestore';

interface LabReportsScreenProps {
    onNavigate: (tab: Tab) => void;
    onBack?: () => void;
}

interface LabReport {
    id: string;
    title: string;
    date: string;
    status: string;
    doctor: string;
    tests: string[];
}

export const LabReportsScreen: React.FC<LabReportsScreenProps> = ({ onNavigate, onBack }) => {
    const { user, showToast } = useAppContext();
    const [reports, setReports] = useState<LabReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('labReports')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                snapshot => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as LabReport[];
                    setReports(data);
                    setLoading(false);
                },
                error => {
                    console.error('Error fetching lab reports:', error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [user?.uid]);

    const handleDownload = (report: LabReport) => {
        showToast(`Downloading ${report.title}...`, 'success');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Lab Reports</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#7c3aed" />
                        <Text style={styles.loadingText}>Loading reports...</Text>
                    </View>
                ) : reports.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <FileText size={48} color="#cbd5e1" />
                        <Text style={styles.emptyTitle}>No Lab Reports Yet</Text>
                        <Text style={styles.emptySubtitle}>Your lab reports will appear here after you book a test.</Text>
                    </View>
                ) : (
                    reports.map((report) => (
                        <View key={report.id} style={styles.reportCard}>
                            <View style={styles.reportHeader}>
                                <View style={styles.iconBox}>
                                    <FileText size={20} color="#7c3aed" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.reportTitle}>{report.title}</Text>
                                    <Text style={styles.reportDate}>{report.date} • {report.doctor}</Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    <Check size={12} color="#16a34a" />
                                    <Text style={styles.statusText}>{report.status}</Text>
                                </View>
                            </View>

                            <View style={styles.testsRow}>
                                {report.tests.map((test, idx) => (
                                    <View key={idx} style={styles.testChip}>
                                        <Text style={styles.testChipText}>{test}</Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(report)}>
                                <Download size={16} color="#2563eb" />
                                <Text style={styles.downloadText}>Download PDF</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginLeft: 16 },
    content: { padding: 16, flexGrow: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
    reportCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    reportHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    reportTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    reportDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
    statusText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
    testsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    testChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    testChipText: { fontSize: 11, color: '#475569', fontWeight: '500' },
    downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', padding: 12, borderRadius: 12, gap: 8 },
    downloadText: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stethoscope, ArrowLeft } from '../components/Icons';
import { Tab } from '../types';

interface ConsultScreenProps {
    onNavigate?: (tab: Tab) => void;
    onBack?: () => void;
}

export const ConsultScreen: React.FC<ConsultScreenProps> = ({ onNavigate, onBack }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate?.(Tab.Home)}>
                        <ArrowLeft size={20} color="#1e293b" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.headerTitle}>Consult Doctors</Text>
                        <Text style={styles.headerSubtitle}>Connect with specialists instantly</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Stethoscope size={64} color="#2563eb" />
                </View>
                <Text style={styles.title}>Doctor Consultation</Text>
                <Text style={styles.subtitle}>Video consult with top doctors from the comfort of your home.</Text>

                <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>COMING SOON</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { backgroundColor: '#fff', paddingBottom: 12, elevation: 2 },
    topRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    backBtn: { padding: 4, borderRadius: 20, backgroundColor: '#f1f5f9' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    headerSubtitle: { fontSize: 12, color: '#64748b', fontWeight: '500' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
    comingSoonBadge: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fef3c7', borderRadius: 20, borderWidth: 1, borderColor: '#fcd34d' },
    comingSoonText: { fontSize: 12, fontWeight: '800', color: '#d97706', letterSpacing: 1 }
});

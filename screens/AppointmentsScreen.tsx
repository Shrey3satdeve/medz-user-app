import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, PanResponder } from 'react-native';
import { ArrowLeft, Calendar, Clock, User, MapPin, Check, Plus } from '../components/Icons';
import { Tab } from '../types';
import { useAppContext } from '../AppContext';
import firestore from '@react-native-firebase/firestore';

interface AppointmentsScreenProps {
    onNavigate: (tab: Tab) => void;
    onBack?: () => void;
}

interface Appointment {
    id: string;
    doctor: string;
    specialization: string;
    date: string;
    time: string;
    location: string;
    status: 'Upcoming' | 'Completed';
    createdAt?: any;
}

const AVAILABLE_DOCTORS = [
    { id: 'd1', name: 'Dr. Priya Sharma', specialization: 'General Physician', fee: 500, available: ['10:00 AM', '11:30 AM', '3:00 PM'] },
    { id: 'd2', name: 'Dr. Rahul Mehta', specialization: 'Diabetologist', fee: 700, available: ['9:00 AM', '12:00 PM', '4:30 PM'] },
    { id: 'd3', name: 'Dr. Anjali Desai', specialization: 'Dermatologist', fee: 600, available: ['10:30 AM', '2:00 PM', '5:00 PM'] },
];

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ onNavigate, onBack }) => {
    const { user, showToast } = useAppContext();
    const [bookingModal, setBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    setBookingModal(false);
                }
            },
        })
    ).current;

    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('appointments')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                snapshot => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Appointment[];
                    setAppointments(data);
                    setLoading(false);
                },
                error => {
                    console.error('Error fetching appointments:', error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [user?.uid]);

    const handleBook = async () => {
        if (!selectedDoctor || !selectedSlot || !user?.uid) return;

        setSaving(true);
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('appointments')
                .add({
                    doctor: selectedDoctor.name,
                    specialization: selectedDoctor.specialization,
                    date: dateStr,
                    time: selectedSlot,
                    location: 'Medz Health Center',
                    status: 'Upcoming',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

            setBookingModal(false);
            setSelectedDoctor(null);
            setSelectedSlot(null);
            showToast('Appointment booked successfully!', 'success');
        } catch (error) {
            console.error('Error booking appointment:', error);
            showToast('Failed to book appointment', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Appointments</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setBookingModal(true)}>
                    <Plus size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2563eb" />
                        <Text style={styles.loadingText}>Loading appointments...</Text>
                    </View>
                ) : appointments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Calendar size={48} color="#cbd5e1" />
                        <Text style={styles.emptyTitle}>No Appointments</Text>
                        <Text style={styles.emptySubtitle}>Tap the + button to book your first appointment.</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>UPCOMING</Text>
                        {appointments.filter(a => a.status === 'Upcoming').map((apt) => (
                            <View key={apt.id} style={styles.aptCard}>
                                <View style={styles.aptHeader}>
                                    <View style={styles.doctorAvatar}>
                                        <User size={20} color="#2563eb" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.doctorName}>{apt.doctor}</Text>
                                        <Text style={styles.specialization}>{apt.specialization}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: '#dbeafe' }]}>
                                        <Text style={[styles.statusText, { color: '#2563eb' }]}>{apt.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailsRow}>
                                    <View style={styles.detailItem}>
                                        <Calendar size={14} color="#64748b" />
                                        <Text style={styles.detailText}>{apt.date}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Clock size={14} color="#64748b" />
                                        <Text style={styles.detailText}>{apt.time}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailItem}>
                                    <MapPin size={14} color="#64748b" />
                                    <Text style={styles.detailText}>{apt.location}</Text>
                                </View>
                            </View>
                        ))}

                        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>PAST</Text>
                        {appointments.filter(a => a.status === 'Completed').map((apt) => (
                            <View key={apt.id} style={[styles.aptCard, { opacity: 0.7 }]}>
                                <View style={styles.aptHeader}>
                                    <View style={[styles.doctorAvatar, { backgroundColor: '#f1f5f9' }]}>
                                        <User size={20} color="#64748b" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.doctorName}>{apt.doctor}</Text>
                                        <Text style={styles.specialization}>{apt.specialization}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
                                        <Check size={12} color="#16a34a" />
                                        <Text style={[styles.statusText, { color: '#16a34a' }]}>{apt.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailsRow}>
                                    <View style={styles.detailItem}>
                                        <Calendar size={14} color="#94a3b8" />
                                        <Text style={[styles.detailText, { color: '#94a3b8' }]}>{apt.date}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Clock size={14} color="#94a3b8" />
                                        <Text style={[styles.detailText, { color: '#94a3b8' }]}>{apt.time}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>

            {/* Booking Modal */}
            <Modal visible={bookingModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View {...panResponder.panHandlers} style={{ width: '100%', alignItems: 'center', paddingBottom: 20 }}>
                            <View style={styles.dragHandle} />
                        </View>
                        <Text style={styles.modalTitle}>Book Appointment</Text>

                        <Text style={styles.modalLabel}>Select Doctor</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                            {AVAILABLE_DOCTORS.map((doc) => (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={[styles.doctorCard, selectedDoctor?.id === doc.id && styles.doctorCardActive]}
                                    onPress={() => { setSelectedDoctor(doc); setSelectedSlot(null); }}
                                >
                                    <Text style={styles.docCardName}>{doc.name}</Text>
                                    <Text style={styles.docCardSpec}>{doc.specialization}</Text>
                                    <Text style={styles.docCardFee}>₹{doc.fee}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {selectedDoctor && (
                            <>
                                <Text style={styles.modalLabel}>Select Time Slot</Text>
                                <View style={styles.slotsRow}>
                                    {selectedDoctor.available.map((slot: string) => (
                                        <TouchableOpacity
                                            key={slot}
                                            style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}
                                            onPress={() => setSelectedSlot(slot)}
                                        >
                                            <Text style={[styles.slotText, selectedSlot === slot && { color: '#fff' }]}>{slot}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.bookBtn, (!selectedDoctor || !selectedSlot || saving) && { opacity: 0.5 }]}
                            onPress={handleBook}
                            disabled={!selectedDoctor || !selectedSlot || saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.bookBtnText}>Confirm Booking</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setBookingModal(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginLeft: 16, flex: 1 },
    addBtn: { backgroundColor: '#2563eb', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 16, flexGrow: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 12 },
    aptCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
    aptHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    doctorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    doctorName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    specialization: { fontSize: 12, color: '#64748b', marginTop: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    statusText: { fontSize: 11, fontWeight: '600' },
    detailsRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 12, color: '#475569' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    dragHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 20 },
    modalLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8 },
    doctorCard: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginRight: 12, minWidth: 140, borderWidth: 2, borderColor: 'transparent' },
    doctorCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
    docCardName: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
    docCardSpec: { fontSize: 11, color: '#64748b', marginTop: 2 },
    docCardFee: { fontSize: 14, fontWeight: '800', color: '#16a34a', marginTop: 8 },
    slotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    slotChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    slotChipActive: { backgroundColor: '#2563eb' },
    slotText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    bookBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, alignItems: 'center' },
    bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    cancelBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
    cancelBtnText: { color: '#64748b', fontWeight: '600' },
});

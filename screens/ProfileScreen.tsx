import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Settings, User, Activity, FileText, ChevronRight, Calendar, Pill, Box, ShoppingBag, LogOut, Camera } from '../components/Icons';
import { TIMELINE } from '../constants';
import { useAppContext } from '../AppContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Modal, TextInput } from 'react-native';
import { Tab } from '../types';

import { SelectionModal } from '../components/SelectionModal';

interface ProfileScreenProps {
    onNavigate?: (tab: Tab) => void;
}

const AGE_OPTIONS = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
    const { orders, showToast, user, setUser } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    // Selection Modal State
    const [selectionModal, setSelectionModal] = React.useState({
        visible: false,
        title: '',
        options: [] as string[],
        field: '' // 'age' | 'gender' | 'bloodGroup'
    });

    const openSelection = (field: string, title: string, options: string[]) => {
        setSelectionModal({ visible: true, title, options, field });
    };

    const handleSelection = (option: string) => {
        setEditForm(prev => ({ ...prev, [selectionModal.field]: option }));
    };

    // Local state for editing
    const [editForm, setEditForm] = React.useState({
        age: '',
        weight: '',
        height: '',
        bloodGroup: '',
        gender: ''
    });

    // Fetch user profile from Firestore on mount
    React.useEffect(() => {
        if (user?.uid) {
            const unsubscribe = firestore()
                .collection('users')
                .doc(user.uid)
                .onSnapshot(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        setUser({ ...user, ...data }); // Sync with context
                        setEditForm({
                            age: data?.age || '',
                            weight: data?.weight || '',
                            height: data?.height || '',
                            bloodGroup: data?.bloodGroup || '',
                            gender: data?.gender || ''
                        });
                    }
                });
            return () => unsubscribe();
        }
    }, [user?.uid]);

    const handleSaveProfile = async () => {
        if (!user?.uid) return;
        setLoading(true);
        try {
            await firestore().collection('users').doc(user.uid).update(editForm);
            showToast('Profile updated!', 'success');
            setEditModalVisible(false);
        } catch (error) {
            console.error(error);
            showToast('Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfilePicture = async () => {
        if (!user?.uid) return;
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                await firestore().collection('users').doc(user.uid).update({
                    avatarUrl: result.assets[0].uri
                });
                showToast('Profile picture updated!', 'success');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to update picture', 'error');
        }
    };

    const displayUser = {
        name: user?.name || 'User',
        avatarUrl: user?.avatarUrl,
        age: user?.age || 'Not Set',
        gender: user?.gender || 'Not Set',
        bloodGroup: user?.bloodGroup || 'Not Set',
        weight: user?.weight || '72',
        height: user?.height || '178'
    };

    const handleMenuPress = (action: string) => {
        showToast(`${action} - Feature coming soon!`);
    };

    const handleLogout = async () => {
        try {
            await auth().signOut();
            setUser(null);
            showToast('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Failed to logout', 'error');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>



                {/* Profile Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.userInfoRow}>
                        <TouchableOpacity style={styles.avatarBox} onPress={handleUpdateProfilePicture}>
                            {displayUser.avatarUrl ? (
                                <Image source={{ uri: displayUser.avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>{displayUser.name.charAt(0)}</Text>
                            )}
                            <View style={styles.editIconBadge}>
                                <Camera size={12} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.userName}>{displayUser.name}</Text>
                            <Text style={styles.userMeta}>
                                {displayUser.age ? `${displayUser.age} Years` : 'Age N/A'}, {displayUser.gender || 'Gender N/A'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.settingsBtn} onPress={() => setEditModalVisible(true)}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statBox, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
                            <Text style={[styles.statLabel, { color: '#2563eb' }]}>Blood Group</Text>
                            <Text style={styles.statValue}>{displayUser.bloodGroup || '-'}</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }]}>
                            <Text style={[styles.statLabel, { color: '#16a34a' }]}>Weight</Text>
                            <Text style={styles.statValue}>{displayUser.weight} kg</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }]}>
                            <Text style={[styles.statLabel, { color: '#9333ea' }]}>Height</Text>
                            <Text style={styles.statValue}>{displayUser.height} cm</Text>
                        </View>
                    </View>
                </View>

                {/* Timeline */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
                        <TouchableOpacity onPress={() => onNavigate?.(Tab.LabReports)}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timelineCard}>
                        {/* Real Orders */}
                        {orders.map((order) => (
                            <View key={order.id} style={styles.timelineItem}>
                                <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                                    <ShoppingBag size={14} color="#16a34a" />
                                </View>
                                <View style={styles.eventContent}>
                                    <View style={styles.eventRow}>
                                        <Text style={styles.eventTitle}>Order #{order.id}</Text>
                                        <Text style={styles.eventDate}>{order.date}</Text>
                                    </View>
                                    <Text style={styles.eventStatus}>{order.items.length} items • ₹{order.total}</Text>
                                </View>
                            </View>
                        ))}

                        {/* Mock Timeline */}
                        {TIMELINE.map((event, index) => (
                            <View key={event.id} style={[styles.timelineItem, (index === TIMELINE.length - 1 && orders.length === 0) && styles.lastItem]}>
                                <View style={[styles.iconBox,
                                event.type === 'Order' ? { backgroundColor: '#eff6ff' } :
                                    event.type === 'LabReport' ? { backgroundColor: '#faf5ff' } : { backgroundColor: '#fff7ed' }
                                ]}>
                                    {event.type === 'Order' && <Pill size={14} color="#2563eb" />}
                                    {event.type === 'LabReport' && <FileText size={14} color="#9333ea" />}
                                    {event.type === 'Consultation' && <User size={14} color="#ea580c" />}
                                </View>
                                <View style={styles.eventContent}>
                                    <View style={styles.eventRow}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <Text style={styles.eventDate}>{event.date}</Text>
                                    </View>
                                    <Text style={styles.eventStatus}>{event.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate?.(Tab.LabReports)}>
                        <View style={styles.menuIconRow}>
                            <View style={[styles.menuIconBox, { backgroundColor: '#fef2f2' }]}>
                                <Activity size={18} color="#ef4444" />
                            </View>
                            <Text style={styles.menuText}>My Lab Reports</Text>
                        </View>
                        <ChevronRight size={18} color="#cbd5e1" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate?.(Tab.Appointments)}>
                        <View style={styles.menuIconRow}>
                            <View style={[styles.menuIconBox, { backgroundColor: '#eff6ff' }]}>
                                <Calendar size={18} color="#3b82f6" />
                            </View>
                            <Text style={styles.menuText}>Appointments</Text>
                        </View>
                        <ChevronRight size={18} color="#cbd5e1" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={styles.menuIconRow}>
                            <View style={[styles.menuIconBox, { backgroundColor: '#fef2f2' }]}>
                                <LogOut size={18} color="#ef4444" />
                            </View>
                            <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
                        </View>
                        <ChevronRight size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Age</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => openSelection('age', 'Select Age', AGE_OPTIONS)}
                                >
                                    <Text style={{ color: editForm.age ? '#1e293b' : '#94a3b8' }}>
                                        {editForm.age || 'Select'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => openSelection('gender', 'Select Gender', GENDER_OPTIONS)}
                                >
                                    <Text style={{ color: editForm.gender ? '#1e293b' : '#94a3b8' }}>
                                        {editForm.gender || 'Select'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.weight}
                                    onChangeText={t => setEditForm(prev => ({ ...prev, weight: t }))}
                                    placeholder="70"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Height (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.height}
                                    onChangeText={t => setEditForm(prev => ({ ...prev, height: t }))}
                                    placeholder="175"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <Text style={styles.inputLabel}>Blood Group</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => openSelection('bloodGroup', 'Select Blood Group', BLOOD_GROUP_OPTIONS)}
                            >
                                <Text style={{ color: editForm.bloodGroup ? '#1e293b' : '#94a3b8' }}>
                                    {editForm.bloodGroup || 'Select'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                            <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Selection Modal */}
            <SelectionModal
                visible={selectionModal.visible}
                title={selectionModal.title}
                options={selectionModal.options}
                onClose={() => setSelectionModal(prev => ({ ...prev, visible: false }))}
                onSelect={handleSelection}
                selectedValue={editForm[selectionModal.field as keyof typeof editForm]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollContent: { paddingBottom: 100 },
    profileHeader: { backgroundColor: '#fff', padding: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24 },
    userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    avatarBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.1, elevation: 4 },
    avatarText: { fontSize: 24, fontWeight: '800', color: '#2563eb' },
    userName: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    userMeta: { fontSize: 14, color: '#64748b', marginTop: 2 },
    settingsBtn: { marginLeft: 'auto', backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 },
    statsRow: { flexDirection: 'row', gap: 12 },
    statBox: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 1 },
    statLabel: { fontSize: 10, fontWeight: '700', marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: '#1e293b', letterSpacing: 0.5 },
    viewAll: { fontSize: 12, fontWeight: '600', color: '#2563eb' },
    timelineCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    timelineItem: { flexDirection: 'row', marginBottom: 20 },
    lastItem: { marginBottom: 0 },
    iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    eventContent: { flex: 1 },
    eventRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    eventTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
    eventDate: { fontSize: 10, color: '#94a3b8', backgroundColor: '#f8fafc', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
    eventStatus: { fontSize: 12, color: '#64748b' },
    menuContainer: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    menuIconRow: { flexDirection: 'row', alignItems: 'center' },
    menuIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuText: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 60 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#1e293b' },
    inputRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    inputLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 6 },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 16, color: '#1e293b' },
    saveBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 24 },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    cancelBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
    cancelBtnText: { color: '#64748b', fontWeight: '600' },
    avatarImage: { width: '100%', height: '100%', borderRadius: 35 },
    editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2563eb', padding: 4, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
});
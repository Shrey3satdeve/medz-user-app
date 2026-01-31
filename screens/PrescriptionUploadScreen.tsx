import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Check, XCircle, FileText, ArrowLeft } from '../components/Icons';
import { theme } from '../src/theme';
import { useAppContext } from '../AppContext';

interface Props {
    onBack: () => void;
    onUploadComplete: () => void;
}

export const PrescriptionUploadScreen: React.FC<Props> = ({ onBack, onUploadComplete }) => {
    const [image, setImage] = useState<string | null>(null);
    const { showToast } = useAppContext();
    const [uploading, setUploading] = useState(false);

    const pickImage = async (useCamera: boolean) => {
        try {
            let result;
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera permission is required to take photos of prescriptions.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
            showToast('Failed to pick image', 'error');
        }
    };

    const handleUpload = () => {
        if (!image) return;

        setUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            setUploading(false);
            showToast('Prescription uploaded successfully!', 'success');
            onUploadComplete();
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.title}>Upload Prescription</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.guideCard}>
                    <Text style={styles.guideTitle}>Valid Prescription Guide</Text>
                    <View style={styles.guideRow}>
                        <Check size={16} color={theme.colors.success} />
                        <Text style={styles.guideText}>Doctor's Name & Signature clearly visible</Text>
                    </View>
                    <View style={styles.guideRow}>
                        <Check size={16} color={theme.colors.success} />
                        <Text style={styles.guideText}>Patient Name & Date included</Text>
                    </View>
                    <View style={styles.guideRow}>
                        <Check size={16} color={theme.colors.success} />
                        <Text style={styles.guideText}>Medicine names are readable</Text>
                    </View>
                </View>

                {image ? (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <TouchableOpacity style={styles.removeBtn} onPress={() => setImage(null)}>
                            <XCircle size={24} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.uploadArea}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(true)}>
                            <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                                <Camera size={32} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.actionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <Text style={styles.orText}>OR</Text>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(false)}>
                            <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                                <ImageIcon size={32} color="#16a34a" />
                            </View>
                            <Text style={styles.actionText}>Select from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {image && (
                    <TouchableOpacity
                        style={[styles.uploadBtn, uploading && styles.disabledBtn]}
                        onPress={handleUpload}
                        disabled={uploading}
                    >
                        <Text style={styles.uploadBtnText}>{uploading ? 'Uploading...' : 'Submit Prescription'}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingTop: 40 },
    backBtn: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    content: { padding: 20 },
    guideCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
    guideTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#1e293b' },
    guideRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    guideText: { fontSize: 14, color: '#64748b' },
    uploadArea: { flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 20 },
    actionBtn: { alignItems: 'center', width: '100%' },
    iconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    actionText: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    orText: { fontSize: 14, color: '#94a3b8', fontWeight: '700' },
    previewContainer: { position: 'relative', borderRadius: 16, overflow: 'hidden', height: 400, backgroundColor: '#000' },
    previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    removeBtn: { position: 'absolute', top: 16, right: 16, backgroundColor: '#fff', borderRadius: 20, padding: 4 },
    uploadBtn: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 32, shadowColor: theme.colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
    disabledBtn: { backgroundColor: '#94a3b8', shadowOpacity: 0, elevation: 0 },
    uploadBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});

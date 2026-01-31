import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { XCircle, MapPin, Check } from './Icons';
import { theme } from '../src/theme';

interface LocationPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (address: string, coords: { latitude: number; longitude: number }) => void;
    initialLocation?: { latitude: number; longitude: number };
}

const { width, height } = Dimensions.get('window');

export const LocationPicker: React.FC<LocationPickerProps> = ({ visible, onClose, onSelectLocation, initialLocation }) => {
    const [region, setRegion] = useState({
        latitude: initialLocation?.latitude || 12.9716, // Default to Bangalore
        longitude: initialLocation?.longitude || 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [selectedAddress, setSelectedAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            getCurrentLocation();
        }
    }, [visible]);

    const getCurrentLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setRegion(newRegion);
            await reverseGeocode(newRegion.latitude, newRegion.longitude);
        } catch (error) {
            console.log('Error getting location', error);
        } finally {
            setLoading(false);
        }
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            setLoading(true);
            const address = await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lng
            });

            if (address.length > 0) {
                const addr = address[0];
                const formatted = `${addr.street || ''} ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
                setSelectedAddress(formatted);
            }
        } catch (error) {
            console.log('Geocoding error', error);
        } finally {
            setLoading(false);
        }
    };

    const onRegionChangeComplete = (newRegion: any) => {
        setRegion(newRegion);
        // optimal: debounce this call
        reverseGeocode(newRegion.latitude, newRegion.longitude);
    };

    const handleConfirm = () => {
        onSelectLocation(selectedAddress || "Pinned Location", { latitude: region.latitude, longitude: region.longitude });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Pick Location</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <XCircle size={24} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Map */}
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={onRegionChangeComplete}
                        showsUserLocation
                        showsMyLocationButton
                    >
                    </MapView>

                    {/* Fixed Marker in Center */}
                    <View style={styles.centeredMarker}>
                        <MapPin size={40} color={theme.colors.primary} fill={theme.colors.primary} />
                    </View>
                </View>

                {/* Footer Address & Confirm */}
                <View style={styles.footer}>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressLabel}>Selected Address</Text>
                        <Text style={styles.addressText} numberOfLines={2}>
                            {loading ? 'Fetching address...' : (selectedAddress || 'Move map to select')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.confirmBtn, (!selectedAddress || loading) && styles.disabledBtn]}
                        onPress={handleConfirm}
                        disabled={!selectedAddress || loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Check size={20} color="#fff" />
                                <Text style={styles.confirmText}>Confirm Location</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingTop: 20 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    closeBtn: { padding: 4 },
    mapContainer: { flex: 1, position: 'relative' },
    map: { width: '100%', height: '100%' },
    centeredMarker: { position: 'absolute', top: '50%', left: '50%', marginTop: -40, marginLeft: -20, pointerEvents: 'none' },
    footer: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
    addressBox: { marginBottom: 16 },
    addressLabel: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 4 },
    addressText: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
    confirmBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
    disabledBtn: { backgroundColor: '#94a3b8' },
    confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ArrowLeft, MapPin, Package, Truck, Check, Clock } from '../components/Icons';
import { Tab } from '../types';
import { useAppContext } from '../AppContext';
import firestore from '@react-native-firebase/firestore';

interface TrackOrderScreenProps {
    onNavigate: (tab: Tab) => void;
    onBack?: () => void;
}

interface OrderData {
    id: string;
    status: string;
    total: number;
    items: any[];
    driverLocation?: {
        latitude: number;
        longitude: number;
    } | null;
}

const { width } = Dimensions.get('window');

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({ onNavigate, onBack }) => {
    const { user, currentOrderId } = useAppContext();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);

    // Default location (Bangalore)
    const DEFAULT_LOCATION = { latitude: 12.9716, longitude: 77.5946 };

    useEffect(() => {
        if (!user?.uid || !currentOrderId) {
            setLoading(false);
            return;
        }

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('orders')
            .doc(currentOrderId)
            .onSnapshot(
                doc => {
                    if (doc.exists) {
                        setOrder({ id: doc.id, ...doc.data() } as OrderData);
                    }
                    setLoading(false);
                },
                error => {
                    console.error('Error loading order:', error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [user?.uid, currentOrderId]);

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Processing': return 1;
            case 'Out for Delivery': return 2;
            case 'Delivered': return 3;
            default: return 1;
        }
    };

    const driverLocation = order?.driverLocation || null;
    const currentStep = getStatusStep(order?.status || 'Processing');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading order details...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Track Order</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Package size={64} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>No Active Order</Text>
                    <Text style={styles.emptySubtitle}>Place an order to start tracking</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Order ID Card */}
                <View style={styles.orderIdCard}>
                    <Text style={styles.orderIdLabel}>Order ID</Text>
                    <Text style={styles.orderIdValue}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: currentStep === 3 ? '#dcfce7' : '#dbeafe' }]}>
                        <Text style={[styles.statusBadgeText, { color: currentStep === 3 ? '#16a34a' : '#2563eb' }]}>
                            {order.status}
                        </Text>
                    </View>
                </View>

                {/* Progress Steps */}
                <View style={styles.progressCard}>
                    <View style={styles.stepRow}>
                        <View style={[styles.stepCircle, currentStep >= 1 && styles.stepActive]}>
                            <Package size={16} color={currentStep >= 1 ? '#fff' : '#94a3b8'} />
                        </View>
                        <View style={[styles.stepLine, currentStep >= 2 && styles.lineActive]} />
                        <View style={[styles.stepCircle, currentStep >= 2 && styles.stepActive]}>
                            <Truck size={16} color={currentStep >= 2 ? '#fff' : '#94a3b8'} />
                        </View>
                        <View style={[styles.stepLine, currentStep >= 3 && styles.lineActive]} />
                        <View style={[styles.stepCircle, currentStep >= 3 && styles.stepActive]}>
                            <Check size={16} color={currentStep >= 3 ? '#fff' : '#94a3b8'} />
                        </View>
                    </View>
                    <View style={styles.labelRow}>
                        <Text style={[styles.stepLabel, currentStep >= 1 && styles.labelActive]}>Order Placed</Text>
                        <Text style={[styles.stepLabel, currentStep >= 2 && styles.labelActive]}>Out for Delivery</Text>
                        <Text style={[styles.stepLabel, currentStep >= 3 && styles.labelActive]}>Delivered</Text>
                    </View>
                </View>

                {/* Live Map */}
                <View style={styles.mapContainer}>
                    <Text style={styles.sectionTitle}>
                        {driverLocation ? '📍 Driver Live Location' : '📍 Delivery Location'}
                    </Text>
                    <View style={styles.mapWrapper}>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: driverLocation?.latitude || DEFAULT_LOCATION.latitude,
                                longitude: driverLocation?.longitude || DEFAULT_LOCATION.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            region={driverLocation ? {
                                latitude: driverLocation.latitude,
                                longitude: driverLocation.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            } : undefined}
                        >
                            {driverLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: driverLocation.latitude,
                                        longitude: driverLocation.longitude,
                                    }}
                                    title="Delivery Partner"
                                    description="Your order is on the way!"
                                >
                                    <View style={styles.driverMarker}>
                                        <Text style={{ fontSize: 20 }}>🛵</Text>
                                    </View>
                                </Marker>
                            )}
                        </MapView>
                        {!driverLocation && currentStep < 2 && (
                            <View style={styles.mapOverlay}>
                                <Clock size={24} color="#64748b" />
                                <Text style={styles.mapOverlayText}>
                                    Driver location will appear{'\n'}when order is out for delivery
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <Text style={styles.itemsText}>
                        {order.items?.length || 0} item(s) • Total: ₹{order.total}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginLeft: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
    loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
    content: { padding: 16, paddingBottom: 100 },
    orderIdCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' },
    orderIdLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 },
    orderIdValue: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
    statusBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    statusBadgeText: { fontSize: 13, fontWeight: '700' },
    progressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    stepActive: { backgroundColor: '#2563eb' },
    stepLine: { flex: 1, height: 4, backgroundColor: '#f1f5f9', marginHorizontal: 8 },
    lineActive: { backgroundColor: '#2563eb' },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    stepLabel: { fontSize: 11, fontWeight: '600', color: '#94a3b8', textAlign: 'center', width: 80 },
    labelActive: { color: '#1e293b' },
    mapContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
    mapWrapper: { height: 200, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    map: { ...StyleSheet.absoluteFillObject },
    driverMarker: { backgroundColor: '#fff', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#2563eb' },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
    mapOverlayText: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 18 },
    summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9' },
    itemsText: { fontSize: 14, color: '#64748b' },
});

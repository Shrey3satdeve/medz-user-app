import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions, Modal } from 'react-native';
import { Pill, FlaskConical, Dog, Search, MapPin, ChevronDown, ArrowRight, Zap, XCircle, Mic } from '../components/Icons';
import { Tab } from '../types';
import { useAppContext } from '../AppContext';
import { theme } from '../src/theme';
import * as Location from 'expo-location';
import { LocationPicker } from '../components/LocationPicker';
import { BannerCarousel } from '../components/BannerCarousel';

interface HomeScreenProps {
    onNavigate: (tab: Tab) => void;
}

const { width } = Dimensions.get('window');

const ALL_CATEGORIES = [
    { name: 'Diabetes', img: 'https://cdn-icons-png.flaticon.com/512/2866/2866321.png' },
    { name: 'Baby Care', img: 'https://cdn-icons-png.flaticon.com/512/3022/3022026.png' },
    { name: 'Skin Care', img: 'https://cdn-icons-png.flaticon.com/512/3050/3050257.png' },
    { name: 'Sexual Wellness', img: 'https://cdn-icons-png.flaticon.com/512/4604/4604436.png' },
    { name: 'Ayurveda', img: 'https://cdn-icons-png.flaticon.com/512/3884/3884307.png' },
    { name: 'Devices', img: 'https://cdn-icons-png.flaticon.com/512/2382/2382461.png' },
    { name: 'Stomach Care', img: 'https://cdn-icons-png.flaticon.com/512/3014/3014526.png' },
    { name: 'Pain Relief', img: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png' },
    { name: 'Cold & Immunity', img: 'https://cdn-icons-png.flaticon.com/512/2854/2854198.png' },
    { name: 'Women Care', img: 'https://cdn-icons-png.flaticon.com/512/2921/2921226.png' },
    { name: 'Ortho Support', img: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png' },
    { name: 'Fitness', img: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png' },
    { name: 'Elderly Care', img: 'https://cdn-icons-png.flaticon.com/512/2382/2382531.png' },
    { name: 'Homeopathy', img: 'https://cdn-icons-png.flaticon.com/512/1048/1048927.png' },
    { name: 'Eye Care', img: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png' },
    { name: 'Dental Care', img: 'https://cdn-icons-png.flaticon.com/512/2966/2966346.png' },
    { name: 'More', img: 'https://cdn-icons-png.flaticon.com/512/2983/2983796.png' },
];

import Voice from '@react-native-voice/voice';

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
    const { setGlobalSearch, setGlobalCategory, user } = useAppContext();
    const [searchText, setSearchText] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = (e) => {
            console.log('onSpeechError:', e);
            setIsListening(false);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (e: any) => {
        console.log('onSpeechResults:', e);
        if (e.value && e.value.length > 0) {
            setSearchText(e.value[0]);
            setIsListening(false);
        }
    };

    const handleVoiceSearch = async () => {
        if (isListening) {
            try {
                await Voice.stop();
                setIsListening(false);
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                await Voice.start('en-US');
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Use actual user from Firebase
    const displayUser = {
        name: user?.name || 'User',
        avatarUrl: user?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff',
        address: user?.address || 'Select your location',
    };

    // Location State
    const [currentAddress, setCurrentAddress] = useState(displayUser.address);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [mapPickerVisible, setMapPickerVisible] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(false);

    const openLocationModal = () => {
        setNewAddress(currentAddress);
        setLocationModalVisible(true);
    };

    const handleMapSelect = (address: string, coords: any) => {
        setCurrentAddress(address);
        setMapPickerVisible(false);
        setLocationModalVisible(false);
    };

    const saveLocation = () => {
        if (newAddress.trim()) {
            setCurrentAddress(newAddress);
            setLocationModalVisible(false);
        }
    };

    const getCurrentLocation = async () => {
        try {
            setLocationModalVisible(false);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            // Reverse geocode
            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (address.length > 0) {
                const addr = address[0];
                const formatted = `${addr.street || ''} ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''} `.trim();
                setCurrentAddress(formatted || "Current Location");
            }
        } catch (error) {
            console.log(error);
            alert('Failed to get location');
        }
    };

    const handleSearchSubmit = () => {
        if (searchText.trim()) {
            setGlobalSearch(searchText);
            setGlobalCategory('All');
            onNavigate(Tab.Pharmacy);
            setSearchText('');
        }
    };

    const handleCategoryPress = (categoryName: string) => {
        setGlobalCategory(categoryName);
        setGlobalSearch('');
        onNavigate(Tab.Pharmacy);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greetingText}>Hello, {displayUser.name.split(' ')[0]}</Text>
                        <TouchableOpacity style={styles.locationButton} onPress={openLocationModal}>
                            <MapPin size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.locationText} numberOfLines={1}>{currentAddress}</Text>
                            <ChevronDown size={14} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.profileImageContainer} onPress={() => onNavigate(Tab.Profile)}>
                        <Image source={{ uri: displayUser.avatarUrl }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Search size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            placeholder='Search medicines, doctors, labs...'
                            placeholderTextColor={theme.colors.textSecondary}
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearchSubmit}
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={handleVoiceSearch} style={[styles.searchButton, isListening && { backgroundColor: theme.colors.error }]}>
                            <Mic size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.content}>

                {/* Slideshow Panel */}
                <BannerCarousel onBannerPress={(item) => onNavigate(item.targetTab)} />

                {/* Core Verticals - Bento Grid */}
                <View style={styles.bentoGrid}>
                    {/* Pharmacy Card */}
                    <TouchableOpacity
                        onPress={() => onNavigate(Tab.Pharmacy)}
                        style={styles.pharmacyCard}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.pharmacyDecor, { backgroundColor: theme.colors.primaryLight }]} />
                        <View style={{ zIndex: 10 }}>
                            <Text style={styles.cardTitle}>Pharmacy</Text>
                            <Text style={[styles.cardSubtitle, { color: theme.colors.primary }]}>in 15 mins</Text>
                            <Text style={styles.cardDesc}>Flat 20% off on first 3 orders</Text>
                        </View>
                        <View style={[styles.iconBadge, { backgroundColor: theme.colors.primary }]}>
                            <Pill size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                    {/* Right Column */}
                    <View style={styles.rightColumn}>
                        {/* Lab Tests */}
                        <TouchableOpacity
                            onPress={() => onNavigate(Tab.LabTests)}
                            style={styles.smallCard}
                            activeOpacity={0.9}
                        >
                            <View style={{ zIndex: 10, flex: 1 }}>
                                <Text style={styles.smallCardTitle}>Lab Tests</Text>
                                <Text style={[styles.discountTag, { color: theme.colors.secondary, backgroundColor: '#eff6ff' }]}>Safe & Hygienic</Text>
                            </View>
                            <FlaskConical color={theme.colors.secondary} size={28} />
                        </TouchableOpacity>

                        {/* Pet Care */}
                        <TouchableOpacity
                            onPress={() => onNavigate(Tab.PetCare)}
                            style={styles.smallCard}
                            activeOpacity={0.9}
                        >
                            <View style={{ zIndex: 10, flex: 1 }}>
                                <Text style={styles.smallCardTitle}>Pet Care</Text>
                                <Text style={[styles.discountTag, { color: '#ea580c', backgroundColor: '#fff7ed' }]}>Treats & Food</Text>
                            </View>
                            <Dog color="#ea580c" size={28} />
                        </TouchableOpacity>
                    </View>
                </View>



                {/* Quick Categories */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shop by Category</Text>
                        <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowAllCategories(true)}>
                            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all</Text>
                            <ArrowRight size={14} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridContainer}>
                        {ALL_CATEGORIES.slice(0, 8).map((cat, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.categoryItem}
                                onPress={() => {
                                    if (cat.name === 'More') {
                                        setShowAllCategories(true);
                                    } else {
                                        handleCategoryPress(cat.name);
                                    }
                                }}
                            >
                                <View style={styles.categoryIconBox}>
                                    <Image source={{ uri: cat.img }} style={styles.categoryImg} resizeMode="contain" />
                                </View>
                                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* All Categories Modal */}
            <Modal
                visible={showAllCategories}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowAllCategories(false)}
            >
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <Text style={styles.greetingText}>All Categories</Text>
                            <TouchableOpacity onPress={() => setShowAllCategories(false)}>
                                <XCircle size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: theme.spacing.m }}>
                        <View style={styles.gridContainer}>
                            {ALL_CATEGORIES.filter(c => c.name !== 'More').map((cat, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.categoryItem}
                                    onPress={() => {
                                        setShowAllCategories(false);
                                        handleCategoryPress(cat.name);
                                    }}
                                >
                                    <View style={styles.categoryIconBox}>
                                        <Image source={{ uri: cat.img }} style={styles.categoryImg} resizeMode="contain" />
                                    </View>
                                    <Text style={[styles.categoryName, { textAlign: 'center', fontSize: 12 }]} numberOfLines={2}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Location Modal */}
            <Modal
                visible={isLocationModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Location</Text>
                            <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                                <XCircle size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>Enter your delivery address</Text>
                        <TextInput
                            style={styles.locationInput}
                            value={newAddress}
                            onChangeText={setNewAddress}
                            placeholder="e.g. 123, Green Street, Mumbai"
                            placeholderTextColor="#94a3b8"
                            multiline
                        />

                        <TouchableOpacity style={styles.saveLocBtn} onPress={saveLocation}>
                            <Text style={styles.saveLocText}>Save Address</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.currentLocBtn} onPress={getCurrentLocation}>
                            <Zap size={16} color={theme.colors.primary} />
                            <Text style={[styles.currentLocText, { color: theme.colors.primary }]}>Use Current Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.currentLocBtn, { marginTop: 12 }]} onPress={() => setMapPickerVisible(true)}>
                            <MapPin size={16} color={theme.colors.primary} />
                            <Text style={[styles.currentLocText, { color: theme.colors.primary }]}>Pick on Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Map Picker Modal */}
            <LocationPicker
                visible={mapPickerVisible}
                onClose={() => setMapPickerVisible(false)}
                onSelectLocation={handleMapSelect}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        backgroundColor: '#fff',
        paddingBottom: theme.spacing.l,
        borderBottomLeftRadius: theme.borderRadius.xl,
        borderBottomRightRadius: theme.borderRadius.xl,
        ...theme.shadows.small
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.m, paddingTop: theme.spacing.l },
    greetingText: { ...theme.typography.h3, color: theme.colors.text },
    locationButton: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationText: { ...theme.typography.caption, color: theme.colors.textSecondary, marginHorizontal: 4, maxWidth: 200 },
    profileImageContainer: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.primaryLight },
    profileImage: { width: '100%', height: '100%' },
    searchContainer: { paddingHorizontal: theme.spacing.m, marginTop: theme.spacing.s },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.l,
        paddingLeft: theme.spacing.m,
        paddingRight: theme.spacing.xs,
        height: 52,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    searchInput: { flex: 1, marginLeft: theme.spacing.s, fontSize: 14, color: theme.colors.text },
    searchButton: {
        backgroundColor: theme.colors.primary,
        padding: 8,
        borderRadius: 10,
    },
    content: { padding: theme.spacing.m, paddingBottom: theme.spacing.l },
    bentoGrid: { flexDirection: 'row', gap: theme.spacing.s, height: 200, marginBottom: theme.spacing.l },
    pharmacyCard: {
        flex: 1.2,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        justifyContent: 'space-between',
        ...theme.shadows.small
    },
    pharmacyDecor: { position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, opacity: 0.5 },
    cardTitle: { ...theme.typography.h2, color: theme.colors.text, marginBottom: 4 },
    cardSubtitle: { ...theme.typography.h3, marginBottom: 8 },
    cardDesc: { ...theme.typography.caption, color: theme.colors.textSecondary },
    iconBadge: { alignSelf: 'flex-start', padding: 10, borderRadius: theme.borderRadius.full },

    rightColumn: { flex: 1, gap: theme.spacing.s },
    smallCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.shadows.small
    },
    smallCardTitle: { ...theme.typography.body, fontWeight: '700', color: theme.colors.text },
    discountTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start', overflow: 'hidden' },


    // ... existing styles ...

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 300 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    modalLabel: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 12 },
    locationInput: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, fontSize: 16, color: '#1e293b', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20, minHeight: 80, textAlignVertical: 'top' },
    saveLocBtn: { backgroundColor: theme.colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
    saveLocText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    currentLocBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
    currentLocText: { fontSize: 14, fontWeight: '700' },



    categoriesSection: { marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
    sectionTitle: { ...theme.typography.h3, color: theme.colors.text },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
    seeAllText: { fontSize: 12, fontWeight: '700', marginRight: 4 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryItem: { width: '23%', alignItems: 'center', marginBottom: theme.spacing.m },
    categoryIconBox: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.l,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...theme.shadows.small
    },
    categoryImg: { width: 32, height: 32 },
    categoryName: { ...theme.typography.caption, color: theme.colors.text, textAlign: 'center' },
});
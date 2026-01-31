import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Dog, Cat, Star, Plus, Minus, XCircle, ShoppingBag } from '../components/Icons';
import { PET_ITEMS } from '../constants';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface PetCareScreenProps {
    onNavigate?: (tab: Tab) => void;
}

export const PetCareScreen: React.FC<PetCareScreenProps> = ({ onNavigate }) => {
    const { addToCart, removeFromCart, getQuantity, showToast, setSelectedProduct, cartCount, cartTotal } = useAppContext();
    const [activePet, setActivePet] = useState<'Dog' | 'Cat'>('Dog');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = PET_ITEMS.filter(item => {
        const matchesPet = item.petType === activePet;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPet && matchesSearch;
    });

    const handleAdd = (item: any) => {
        addToCart(item);
    }

    const handlePressProduct = (item: any) => {
        setSelectedProduct(item);
        onNavigate?.(Tab.ProductDetails);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pet Care</Text>
                <View style={styles.searchBox}>
                    <Search size={16} color="#94a3b8" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={`Search ${activePet} food...`}
                        style={styles.searchInput}
                    />
                </View>
                <View style={styles.toggleContainer}>
                    <View style={[styles.toggleBg, activePet === 'Cat' && { left: '50%' }]} />
                    <TouchableOpacity onPress={() => setActivePet('Dog')} style={styles.toggleBtn}>
                        <Dog size={16} color={activePet === 'Dog' ? '#1e293b' : '#64748b'} />
                        <Text style={[styles.toggleText, activePet === 'Dog' && styles.activeToggleText]}>Dogs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActivePet('Cat')} style={styles.toggleBtn}>
                        <Cat size={16} color={activePet === 'Cat' ? '#1e293b' : '#64748b'} />
                        <Text style={[styles.toggleText, activePet === 'Cat' && styles.activeToggleText]}>Cats</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Best for your {activePet}</Text>

                <View style={styles.grid}>
                    {filteredItems.map((item) => {
                        const qty = getQuantity(item.id);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                activeOpacity={0.9}
                                onPress={() => handlePressProduct(item)}
                            >
                                <View style={styles.imageBox}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.ratingBadge}>
                                        <Star size={10} color="#eab308" fill="#eab308" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.brandName}>by {item.brand}</Text>

                                <View style={styles.footer}>
                                    <View>
                                        <Text style={styles.mrp}>₹{item.mrp}</Text>
                                        <Text style={styles.price}>₹{item.price}</Text>
                                    </View>
                                    {qty === 0 ? (
                                        <TouchableOpacity onPress={() => handleAdd(item)} style={styles.addBtn}>
                                            <Plus size={18} color="#c2410c" />
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.qtyContainer}>
                                            <TouchableOpacity onPress={() => removeFromCart(item.id)}><Minus size={12} color="#c2410c" /></TouchableOpacity>
                                            <Text style={styles.qtyText}>{qty}</Text>
                                            <TouchableOpacity onPress={() => handleAdd(item)}><Plus size={12} color="#c2410c" /></TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {cartCount > 0 && (
                <View style={styles.floatingCartContainer}>
                    <TouchableOpacity
                        style={styles.cartBar}
                        activeOpacity={0.9}
                        onPress={() => onNavigate?.(Tab.Cart)}
                    >
                        <View>
                            <Text style={styles.cartCountText}>{cartCount} items</Text>
                            <Text style={styles.viewCartText}>View Cart</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.cartTotalText}>₹{cartTotal}</Text>
                            <ShoppingBag size={18} color="white" style={{ marginLeft: 8 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff7ed' },
    header: { backgroundColor: '#fff', padding: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#ea580c', shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
    title: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 25, height: 44, padding: 4, position: 'relative' },
    toggleBg: { position: 'absolute', top: 4, left: 4, width: '48%', height: 36, backgroundColor: '#fff', borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
    toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 1 },
    toggleText: { fontWeight: '600', color: '#64748b' },
    activeToggleText: { color: '#1e293b', fontWeight: '800' },
    scrollContent: { padding: 16, paddingBottom: 120 },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: '#fff7ed' },
    imageBox: { height: 120, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 8, overflow: 'hidden' },
    image: { width: '100%', height: '100%' },
    ratingBadge: { position: 'absolute', top: 6, right: 6, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    ratingText: { fontSize: 10, fontWeight: '700', marginLeft: 2 },
    itemName: { fontSize: 12, fontWeight: '700', color: '#1e293b', height: 32 },
    brandName: { fontSize: 10, color: '#64748b', marginTop: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
    mrp: { fontSize: 10, textDecorationLine: 'line-through', color: '#94a3b8' },
    price: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
    addBtn: { backgroundColor: '#ffedd5', padding: 6, borderRadius: 8 },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffedd5', padding: 4, borderRadius: 8, gap: 6 },
    qtyText: { fontSize: 12, fontWeight: '700', color: '#c2410c' },
    floatingCartContainer: { position: 'absolute', bottom: 16, left: 16, right: 16 },
    cartBar: { backgroundColor: '#ea580c', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#ea580c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    cartCountText: { color: '#fed7aa', fontSize: 11, fontWeight: '600' },
    viewCartText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    cartTotalText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
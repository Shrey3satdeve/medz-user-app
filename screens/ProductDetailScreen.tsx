import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Star, ShieldCheck, Clock, AlertTriangle, Plus, Minus } from '../components/Icons';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface ProductDetailScreenProps {
    onNavigate: (tab: Tab) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ onNavigate }) => {
    const { selectedProduct, addToCart, removeFromCart, getQuantity, showToast } = useAppContext();

    if (!selectedProduct) {
        onNavigate(Tab.Home);
        return null;
    }

    const qty = getQuantity(selectedProduct.id);
    const isMedicine = selectedProduct.type === 'medicine';

    const handleAdd = () => {
        addToCart(selectedProduct);
        if (qty === 0) showToast(`Added to cart`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate(isMedicine ? Tab.Pharmacy : Tab.PetCare)} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedProduct.image }} style={styles.productImage} />
                    {isMedicine && selectedProduct.requiresPrescription && (
                        <View style={styles.rxBadge}>
                            <Text style={styles.rxText}>Prescription Required</Text>
                        </View>
                    )}
                </View>

                {/* Title & Brand */}
                <View style={styles.infoContainer}>
                    <Text style={styles.brandName}>{selectedProduct.brand}</Text>
                    <Text style={styles.productName}>{selectedProduct.name}</Text>
                    
                    {isMedicine && <Text style={styles.strength}>{selectedProduct.strength}</Text>}
                    
                    <View style={styles.ratingRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>4.5</Text>
                            <Star size={10} color="#fff" fill="#fff" />
                        </View>
                        <Text style={styles.ratingCount}>214 ratings</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Price & ETA */}
                <View style={styles.priceRow}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.price}>₹{selectedProduct.price}</Text>
                            <Text style={styles.mrp}>₹{selectedProduct.mrp}</Text>
                            <Text style={styles.discount}>{selectedProduct.mrp > selectedProduct.price ? `${Math.round(((selectedProduct.mrp - selectedProduct.price)/selectedProduct.mrp)*100)}% OFF` : ''}</Text>
                        </View>
                        <Text style={styles.taxText}>Inclusive of all taxes</Text>
                    </View>
                </View>

                {/* Delivery Info */}
                <View style={styles.deliveryInfo}>
                    <Clock size={16} color="#15803d" />
                    <Text style={styles.deliveryText}>
                        Delivered in <Text style={{ fontWeight: '700' }}>{isMedicine ? selectedProduct.eta : selectedProduct.deliveryTime}</Text>
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Mock Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <Text style={styles.description}>
                        This is a premium quality product from {selectedProduct.brand}. 
                        It is trusted by thousands of customers for its efficacy and reliability.
                        {isMedicine ? ' Store in a cool, dry place away from sunlight.' : ' Perfect for your pet\'s daily needs.'}
                    </Text>
                </View>

                {isMedicine && (
                    <View style={styles.safetyBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <ShieldCheck size={16} color="#475569" />
                            <Text style={styles.safetyTitle}>Safety Information</Text>
                        </View>
                        <Text style={styles.safetyText}>
                            • Read the label carefully before use{'\n'}
                            • Do not exceed the recommended dose{'\n'}
                            • Keep out of reach of children
                        </Text>
                    </View>
                )}

                <View style={{ height: 100 }} /> 
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                {qty === 0 ? (
                    <TouchableOpacity style={styles.addToCartBtn} onPress={handleAdd}>
                        <Text style={styles.btnText}>Add to Cart</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.qtyControlRow}>
                        <View style={styles.qtyCounter}>
                            <TouchableOpacity onPress={() => removeFromCart(selectedProduct.id)} style={styles.qtyBtn}>
                                <Minus size={20} color="#166534" />
                            </TouchableOpacity>
                            <Text style={styles.qtyVal}>{qty}</Text>
                            <TouchableOpacity onPress={handleAdd} style={styles.qtyBtn}>
                                <Plus size={20} color="#166534" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.viewCartBtn} onPress={() => onNavigate(Tab.Cart)}>
                            <Text style={styles.btnText}>View Cart</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 16, backgroundColor: '#fff' },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    scrollContent: { paddingBottom: 20 },
    imageContainer: { alignItems: 'center', justifyContent: 'center', height: 250, backgroundColor: '#f8fafc', marginHorizontal: 16, borderRadius: 16, marginBottom: 16 },
    productImage: { width: 200, height: 200, resizeMode: 'contain' },
    rxBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: '#fff1f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#ffe4e6' },
    rxText: { color: '#e11d48', fontSize: 10, fontWeight: '700' },
    infoContainer: { paddingHorizontal: 16 },
    brandName: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
    productName: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginVertical: 4 },
    strength: { fontSize: 14, color: '#475569', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 2 },
    ratingText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    ratingCount: { color: '#64748b', fontSize: 12 },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
    priceRow: { paddingHorizontal: 16 },
    price: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
    mrp: { fontSize: 14, textDecorationLine: 'line-through', color: '#94a3b8' },
    discount: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
    taxText: { fontSize: 11, color: '#94a3b8' },
    deliveryInfo: { marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 10, borderRadius: 8, gap: 8 },
    deliveryText: { fontSize: 12, color: '#166534' },
    section: { paddingHorizontal: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
    description: { fontSize: 14, color: '#475569', lineHeight: 22 },
    safetyBox: { margin: 16, padding: 12, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    safetyTitle: { fontSize: 12, fontWeight: '700', color: '#334155' },
    safetyText: { fontSize: 12, color: '#64748b', lineHeight: 18, marginLeft: 4 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', elevation: 20 },
    addToCartBtn: { backgroundColor: '#16a34a', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    qtyControlRow: { flexDirection: 'row', gap: 12 },
    qtyCounter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', borderRadius: 12, paddingHorizontal: 12, height: 50, borderWidth: 1, borderColor: '#bbf7d0' },
    qtyBtn: { padding: 4 },
    qtyVal: { fontSize: 18, fontWeight: '700', color: '#166534' },
    viewCartBtn: { flex: 1, backgroundColor: '#16a34a', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
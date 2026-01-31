import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShieldCheck } from '../components/Icons';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface CartScreenProps {
    onNavigate: (tab: Tab) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onNavigate }) => {
    const { cart, addToCart, removeFromCart, cartTotal } = useAppContext();

    const deliveryFee = cartTotal > 500 ? 0 : 40;
    const taxes = Math.round(cartTotal * 0.05); // 5% tax
    const grandTotal = cartTotal + deliveryFee + taxes;

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png" }} style={styles.emptyImage} />
                <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
                <TouchableOpacity onPress={() => onNavigate(Tab.Pharmacy)} style={styles.shopBtn}>
                    <Text style={styles.shopBtnText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate(Tab.Home)} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Items List */}
                <View style={styles.section}>
                    {cart.map((item) => (
                        <View key={item.product.id} style={styles.itemCard}>
                            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                                <Text style={styles.itemMeta}>₹{item.product.price}</Text>
                            </View>
                            <View style={styles.qtyBox}>
                                <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.qtyBtn}>
                                    <Minus size={14} color="#1e293b" />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => addToCart(item.product)} style={styles.qtyBtn}>
                                    <Plus size={14} color="#1e293b" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bill Details */}
                <View style={styles.billCard}>
                    <Text style={styles.billTitle}>Bill Summary</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <Text style={styles.billValue}>₹{cartTotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Taxes & Charges</Text>
                        <Text style={styles.billValue}>₹{taxes}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={[styles.billValue, deliveryFee === 0 && { color: '#16a34a' }]}>
                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.billRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
                    </View>
                </View>

                <View style={styles.trustBanner}>
                    <ShieldCheck size={20} color="#166534" />
                    <Text style={styles.trustText}>Safe & Secure Payment 100% Authentic Products</Text>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerTotalLabel}>Total to Pay</Text>
                    <Text style={styles.footerTotalValue}>₹{grandTotal}</Text>
                </View>
                <TouchableOpacity onPress={() => onNavigate(Tab.Checkout)} style={styles.checkoutBtn}>
                    <Text style={styles.checkoutText}>Checkout</Text>
                    <ArrowRight size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginLeft: 16 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    emptyImage: { width: 150, height: 150, opacity: 0.5, marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 8, marginBottom: 24 },
    shopBtn: { backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    shopBtnText: { color: 'white', fontWeight: '700' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    section: { marginBottom: 24 },
    itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
    itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f1f5f9' },
    itemDetails: { flex: 1, marginHorizontal: 12 },
    itemName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    itemMeta: { fontSize: 14, fontWeight: '600', color: '#64748b', marginTop: 4 },
    qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 4 },
    qtyBtn: { padding: 4 },
    qtyText: { width: 20, textAlign: 'center', fontSize: 14, fontWeight: '700' },
    billCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    billTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 16 },
    billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    billLabel: { fontSize: 14, color: '#64748b' },
    billValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 },
    grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
    grandTotalValue: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
    trustBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, backgroundColor: '#dcfce7', padding: 12, borderRadius: 8 },
    trustText: { marginLeft: 8, fontSize: 11, fontWeight: '600', color: '#166534', width: '80%' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', elevation: 10 },
    footerTotalLabel: { fontSize: 12, color: '#64748b' },
    footerTotalValue: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    checkoutBtn: { backgroundColor: '#16a34a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 },
    checkoutText: { color: 'white', fontWeight: '800', fontSize: 16 },
});
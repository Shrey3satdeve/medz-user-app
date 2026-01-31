import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, CheckCircle2 } from '../components/Icons';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';

interface CheckoutScreenProps {
    onNavigate: (tab: Tab) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate }) => {
    const { cartTotal, placeOrder, user, showToast } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('UPI');

    // Payment State
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const deliveryFee = cartTotal > 500 ? 0 : 40;
    const taxes = Math.round(cartTotal * 0.05);
    const grandTotal = cartTotal + deliveryFee + taxes;

    const handlePayment = () => {
        // 1. Validate Address
        if (!user?.address) {
            showToast('Please select a delivery address', 'error');
            return;
        }

        // 2. Validate Payment
        if (selectedPayment === 'UPI') {
            if (!upiId.trim()) {
                showToast('Please enter a valid UPI ID', 'error');
                return;
            }
        } else if (selectedPayment === 'Card') {
            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                showToast('Please fill all card details', 'error');
                return;
            }
            if (cardNumber.length < 16) {
                showToast('Invalid Card Number', 'error');
                return;
            }
        }
        // COD needs no extra validation

        setLoading(true);
        setTimeout(() => {
            placeOrder();
            setLoading(false);
            onNavigate(Tab.OrderSuccess);
        }, 2000); // Simulate Payment Delay
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate(Tab.Cart)} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Address Section */}
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <View style={styles.addressCard}>
                    <View style={styles.addressIcon}>
                        <MapPin size={24} color="#2563eb" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addressType}>Home</Text>
                        <Text style={styles.addressText}>{user?.address || 'Select your delivery address'}</Text>
                        <Text style={styles.phoneText}>+91 98765 43210</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changeText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Section */}
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.paymentContainer}>
                    {[
                        { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                        { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                        { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                    ].map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedPayment === method.id;
                        return (
                            <TouchableOpacity
                                key={method.id}
                                style={[styles.paymentOption, isSelected && styles.paymentOptionActive]}
                                onPress={() => setSelectedPayment(method.id)}
                            >
                                <View style={styles.paymentRow}>
                                    <Icon size={24} color={isSelected ? '#16a34a' : '#64748b'} />
                                    <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelActive]}>
                                        {method.label}
                                    </Text>
                                </View>
                                <View style={[styles.radio, isSelected && styles.radioActive]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Card Input Simulation (Only if Card selected) */}
                {selectedPayment === 'Card' && (
                    <View style={styles.cardForm}>
                        <TextInput
                            placeholder="Card Number"
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={16}
                            value={cardNumber}
                            onChangeText={setCardNumber}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TextInput
                                placeholder="MM/YY"
                                style={[styles.input, { flex: 1 }]}
                                value={cardExpiry}
                                onChangeText={setCardExpiry}
                            />
                            <TextInput
                                placeholder="CVV"
                                style={[styles.input, { flex: 1 }]}
                                maxLength={3}
                                secureTextEntry
                                value={cardCvv}
                                onChangeText={setCardCvv}
                            />
                        </View>
                        <TextInput
                            placeholder="Name on Card"
                            style={styles.input}
                            value={cardName}
                            onChangeText={setCardName}
                        />
                    </View>
                )}

                {/* UPI Input Simulation */}
                {selectedPayment === 'UPI' && (
                    <View style={styles.cardForm}>
                        <TextInput
                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                            style={styles.input}
                            keyboardType="email-address"
                            value={upiId}
                            onChangeText={setUpiId}
                        />
                        <Text style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Verify on your UPI App after clicking pay</Text>
                    </View>
                )}

                {/* Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Amount</Text>
                        <Text style={styles.summaryValue}>₹{grandTotal}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, loading && styles.payBtnDisabled]}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.payBtnText}>PAY ₹{grandTotal}</Text>
                    )}
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
    scrollContent: { padding: 16, paddingBottom: 100 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, marginTop: 12 },
    addressCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
    addressIcon: { marginRight: 12, marginTop: 2 },
    addressType: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
    addressText: { fontSize: 12, color: '#64748b', marginVertical: 4 },
    phoneText: { fontSize: 12, fontWeight: '600', color: '#334155' },
    changeText: { fontSize: 12, fontWeight: '700', color: '#2563eb' },
    paymentContainer: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
    paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    paymentOptionActive: { backgroundColor: '#f0fdf4' },
    paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    paymentLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    paymentLabelActive: { color: '#166534', fontWeight: '700' },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: '#16a34a' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },
    cardForm: { marginTop: 12, gap: 12 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 12, borderRadius: 8, fontSize: 14 },
    summaryCard: { marginTop: 24, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    summaryValue: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    payBtn: { backgroundColor: '#16a34a', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    payBtnDisabled: { backgroundColor: '#86efac' },
    payBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
});
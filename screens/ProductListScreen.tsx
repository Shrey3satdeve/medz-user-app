import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Minus, Star } from '../components/Icons';
import { MEDICINES, PET_ITEMS } from '../constants';
import { useAppContext } from '../AppContext';

// Combine datasets for a generic list view
const ALL_PRODUCTS = [...MEDICINES, ...PET_ITEMS];

export const ProductListScreen: React.FC = () => {
  const { addToCart, removeFromCart, getQuantity } = useAppContext();

  const renderItem = ({ item }: { item: any }) => {
    const qty = getQuantity(item.id);
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.mrp > item.price && (
                <Text style={styles.mrp}>₹{item.mrp}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
           {qty === 0 ? (
               <TouchableOpacity onPress={() => addToCart(item)} style={styles.addBtn}>
                   <Plus size={20} color="#15803d" />
               </TouchableOpacity>
           ) : (
               <View style={styles.qtyControls}>
                   <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                       <Minus size={16} color="#15803d" />
                   </TouchableOpacity>
                   <Text style={styles.qty}>{qty}</Text>
                   <TouchableOpacity onPress={() => addToCart(item)}>
                       <Plus size={16} color="#15803d" />
                   </TouchableOpacity>
               </View>
           )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>All Products</Text>
      <FlatList
        data={ALL_PRODUCTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16, color: '#0f172a' },
  list: { paddingBottom: 80 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  content: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  brand: { fontSize: 12, color: '#64748b' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  price: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  mrp: { fontSize: 12, textDecorationLine: 'line-through', color: '#94a3b8' },
  actions: { marginLeft: 8 },
  addBtn: { padding: 8, backgroundColor: '#dcfce7', borderRadius: 8 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#dcfce7', padding: 6, borderRadius: 8 },
  qty: { fontSize: 14, fontWeight: '700', color: '#15803d' },
});
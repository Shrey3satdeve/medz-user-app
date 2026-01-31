
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Search, ShoppingBag, Clock, Plus, Minus, ArrowLeft, XCircle, FileText, Camera } from '../components/Icons';
import { MEDICINES, ALL_CATEGORIES } from '../constants';
import { useAppContext } from '../AppContext';
import { Tab } from '../types';
import { PrescriptionUploadScreen } from './PrescriptionUploadScreen';

interface PharmacyScreenProps {
  onNavigate?: (tab: Tab) => void;
}

export const PharmacyScreen: React.FC<PharmacyScreenProps> = ({ onNavigate }) => {
  const {
    addToCart,
    removeFromCart,
    getQuantity,
    cartTotal,
    cartCount,
    showToast,
    setSelectedProduct,
    globalSearch,
    globalCategory,
    setGlobalSearch,
    setGlobalCategory
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredMedicines, setFilteredMedicines] = useState(MEDICINES);
  const [isUploading, setIsUploading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Sync with global state when mounted or when global state changes
  useEffect(() => {
    if (globalSearch) {
      setSearchQuery(globalSearch);
      setActiveCategory('All');
    }
    if (globalCategory && globalCategory !== 'All') {
      setActiveCategory(globalCategory);
    }
  }, [globalSearch, globalCategory]);

  useEffect(() => {
    let result = MEDICINES;

    // Filter by Category
    if (activeCategory !== 'All') {
      if (activeCategory === 'More') {
        // No op
      } else {
        result = result.filter(m => m.condition === activeCategory);
      }
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.condition.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredMedicines(result);
  }, [searchQuery, activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setGlobalCategory(cat);
    setGlobalSearch('');
    setSearchQuery('');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setGlobalSearch(text);
  };

  const handleAdd = (med: any) => {
    setAddingId(med.id);
    addToCart(med);
    setTimeout(() => setAddingId(null), 500);


  };

  const handlePressProduct = (med: any) => {
    setSelectedProduct(med);
    onNavigate?.(Tab.ProductDetails);
  };

  const renderItem = ({ item: med }: { item: any }) => {
    const qty = getQuantity(med.id);
    const isAdding = addingId === med.id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handlePressProduct(med)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: med.image }} style={styles.productImage} />
          <View style={styles.etaBadge}>
            <Clock size={10} color="#334155" />
            <Text style={styles.etaText}>{med.eta}</Text>
          </View>
          {med.requiresPrescription && (
            <View style={styles.rxBadge}>
              <FileText size={10} color="#e11d48" />
              <Text style={styles.rxText}>Rx</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>{med.name}</Text>
          <Text style={styles.productMeta}>{med.strength} • {med.brand}</Text>

          <View style={styles.actionRow}>
            <View>
              <Text style={styles.mrpText}>₹{med.mrp}</Text>
              <Text style={styles.priceText}>₹{med.price}</Text>
            </View>

            {qty === 0 ? (
              <TouchableOpacity
                onPress={() => handleAdd(med)}
                style={[
                  styles.addButton,
                  isAdding && { backgroundColor: '#16a34a', borderColor: '#16a34a' }
                ]}
              >
                <Text style={[
                  styles.addButtonText,
                  isAdding && { color: '#fff' }
                ]}>
                  {isAdding ? '✓' : 'ADD'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => removeFromCart(med.id)} style={styles.qtyBtn}>
                  <Minus size={14} color="white" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity onPress={() => handleAdd(med)} style={styles.qtyBtn}>
                  <Plus size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isUploading) {
    return <PrescriptionUploadScreen onBack={() => setIsUploading(false)} onUploadComplete={() => setIsUploading(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate?.(Tab.Home)}>
            <ArrowLeft size={20} color="#1e293b" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Pharmacy</Text>
            <Text style={styles.headerSubtitle}>Delivering in 8 mins</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Search size={16} color="#94a3b8" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search medicines..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <XCircle size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
          <TouchableOpacity
            onPress={() => handleCategoryChange('All')}
            style={[styles.catChip, activeCategory === 'All' && styles.activeCatChip]}
          >
            <Text style={[styles.catText, activeCategory === 'All' && styles.activeCatText]}>All</Text>
          </TouchableOpacity>
          {ALL_CATEGORIES.filter(c => c.name !== 'More').map((cat, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleCategoryChange(cat.name)}
              style={[styles.catChip, activeCategory === cat.name && styles.activeCatChip]}
            >
              <Image source={{ uri: cat.img }} style={{ width: 20, height: 20, marginRight: 6 }} resizeMode="contain" />
              <Text style={[styles.catText, activeCategory === cat.name && styles.activeCatText]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.uploadBanner} onPress={() => setIsUploading(true)}>
        <View style={styles.uploadIconCircle}>
          <Camera size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.uploadTitle}>Order with Prescription</Text>
          <Text style={styles.uploadSubtitle}>Upload photo & we'll pack it for you</Text>
        </View>
        <View style={styles.uploadArrow}>
          <ArrowLeft size={16} color="#16a34a" style={{ transform: [{ rotate: '180deg' }] }} />
        </View>
      </TouchableOpacity>

      <FlatList
        data={filteredMedicines}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Search size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No medicines found</Text>
            {activeCategory !== 'All' && <Text style={{ fontSize: 12, color: '#94a3b8' }}>in {activeCategory}</Text>}
          </View>
        }
      />

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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  topRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { padding: 4, borderRadius: 20, backgroundColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', marginHorizontal: 16, paddingHorizontal: 12, borderRadius: 10, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#334155' },
  catScroll: { marginTop: 12 },
  catScrollContent: { paddingHorizontal: 16, gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', marginRight: 8 },
  activeCatChip: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  catText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  activeCatText: { color: '#fff' },
  uploadBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', marginHorizontal: 16, marginTop: 16, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  uploadIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  uploadTitle: { fontSize: 14, fontWeight: '800', color: '#14532d' },
  uploadSubtitle: { fontSize: 12, color: '#15803d', fontWeight: '500' },
  uploadArrow: { marginLeft: 'auto', backgroundColor: '#fff', padding: 6, borderRadius: 20 },
  listContent: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#fff', width: '48%', borderRadius: 12, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  imageContainer: { height: 110, backgroundColor: '#f8fafc', borderRadius: 8, marginBottom: 8, overflow: 'hidden' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  etaBadge: { position: 'absolute', bottom: 4, left: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  etaText: { fontSize: 9, fontWeight: '700', color: '#334155', marginLeft: 2 },
  rxBadge: { position: 'absolute', top: 4, right: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff1f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: '#ffe4e6' },
  rxText: { fontSize: 9, fontWeight: '900', color: '#e11d48', marginLeft: 2 },
  cardContent: { flex: 1 },
  productName: { fontSize: 12, fontWeight: '700', color: '#1e293b', lineHeight: 16, height: 32 },
  productMeta: { fontSize: 10, color: '#64748b', marginVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  mrpText: { fontSize: 10, textDecorationLine: 'line-through', color: '#94a3b8' },
  priceText: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  addButton: { borderWidth: 1, borderColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  addButtonText: { fontSize: 10, fontWeight: '800', color: '#15803d' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 4 },
  qtyBtn: { width: 20, alignItems: 'center' },
  qtyText: { color: 'white', fontSize: 11, fontWeight: '700', width: 16, textAlign: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', height: 200 },
  emptyText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  floatingCartContainer: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  cartBar: { backgroundColor: '#16a34a', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  cartCountText: { color: '#dcfce7', fontSize: 11, fontWeight: '600' },
  viewCartText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cartTotalText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
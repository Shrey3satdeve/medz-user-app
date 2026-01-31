import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../src/theme';

import { Tab } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - theme.spacing.m * 2;

const BANNERS = [
    {
        id: '1',
        title: 'Wholesome food \nfor active tails',
        subtitle: 'Give the best to your pets',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
        tag: 'Pet Care',
        color: '#fff7ed',
        textColor: '#ea580c',
        targetTab: Tab.PetCare
    },
    {
        id: '2',
        title: 'Up to 15% OFF \non Medicines',
        subtitle: 'Upload prescription now',
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80',
        tag: 'Pharmacy',
        color: '#eff6ff',
        textColor: '#2563eb',
        targetTab: Tab.Pharmacy
    },
    {
        id: '3',
        title: 'Full Body Checkup \n@ 999',
        subtitle: 'Includes 60+ tests',
        image: 'https://images.unsplash.com/photo-1579684385136-137af18db00e?auto=format&fit=crop&w=800&q=80',
        tag: 'Lab Tests',
        color: '#f0fdf4',
        textColor: '#16a34a',
        targetTab: Tab.LabTests
    }
];

interface BannerCarouselProps {
    onBannerPress?: (item: any) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerPress }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= BANNERS.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setActiveIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const renderItem = ({ item }: { item: typeof BANNERS[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.cardContainer, { backgroundColor: item.color }]}
            onPress={() => onBannerPress && onBannerPress(item)}
        >
            <View style={styles.textContainer}>
                <View style={[styles.tag, { backgroundColor: item.textColor + '20' }]}>
                    <Text style={[styles.tagText, { color: item.textColor }]}>{item.tag}</Text>
                </View>
                <Text style={[styles.title, { color: '#1e293b' }]}>{item.title}</Text>
                <Text style={[styles.subtitle, { color: '#64748b' }]}>{item.subtitle}</Text>
                <View style={[styles.button, { backgroundColor: item.textColor }]}>
                    <Text style={styles.buttonText}>Shop Now</Text>
                </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
    );

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / CARD_WIDTH);
        setActiveIndex(index);
    };

    const getItemLayout = (_: any, index: number) => ({
        length: CARD_WIDTH,
        offset: (CARD_WIDTH + theme.spacing.s) * index,
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={BANNERS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled={false} // Custom paging with snapToInterval
                snapToInterval={CARD_WIDTH + theme.spacing.s}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingHorizontal: theme.spacing.m, gap: theme.spacing.s }}
                getItemLayout={getItemLayout}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? theme.colors.primary : '#cbd5e1' }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.l,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: theme.borderRadius.l,
        flexDirection: 'row',
        overflow: 'hidden',
        padding: theme.spacing.m,
        alignItems: 'center',
        ...theme.shadows.small
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
        zIndex: 10,
    },
    tag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '800',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 4,
        lineHeight: 24,
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 12,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        transform: [{ rotate: '15deg' }, { scale: 1.2 }, { translateX: 20 }],
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    }
});

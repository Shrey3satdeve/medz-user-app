import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Pill } from '../components/Icons';

export const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconBox}>
            <Pill size={48} color="#16a34a" fill="#dcfce7" />
        </View>
        <Text style={styles.logoText}>Medz</Text>
        <Text style={styles.tagline}>Healthcare simplified.</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Fast • Reliable</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16a34a', // Brand Green
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: '#dcfce7',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    color: '#bbf7d0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
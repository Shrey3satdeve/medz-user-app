import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Pill, FlaskConical, Dog, User, Grid, Printer, ShoppingBag, Stethoscope } from './Icons';
import { Tab } from '../types';
import { theme } from '../src/theme';

// Export constant height for use in screens
export const BOTTOM_TAB_HEIGHT = 70;

interface BottomTabsProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ currentTab, onTabChange }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: Tab.Home, label: 'Home', icon: Home },
    { id: Tab.TrackOrder, label: 'Order Again', icon: ShoppingBag },
    { id: Tab.Categories, label: 'Categories', icon: Grid },
    { id: Tab.Consult, label: 'Consult', icon: Stethoscope },
  ];

  // Calculate bottom padding: use safe area inset or fallback for Android nav bar
  const bottomPadding = Platform.OS === 'ios'
    ? insets.bottom
    : Math.max(insets.bottom, 10);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isActive && { backgroundColor: theme.colors.primaryLight }
              ]}>
                <Icon
                  size={isActive ? 22 : 24}
                  color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                />
              </View>
              <Text style={[
                styles.label,
                isActive ? { color: theme.colors.primary, fontWeight: '700' } : { color: theme.colors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: BOTTOM_TAB_HEIGHT,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 16,
    marginBottom: 4,
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, BackHandler, LayoutAnimation, Platform, UIManager, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { HomeScreen } from './screens/HomeScreen';
import { PharmacyScreen } from './screens/PharmacyScreen';
import { LabTestsScreen } from './screens/LabTestsScreen';
import { PetCareScreen } from './screens/PetCareScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { LabDetailScreen } from './screens/LabDetailScreen';
import { LabReportsScreen } from './screens/LabReportsScreen';
import { AppointmentsScreen } from './screens/AppointmentsScreen';
import { TrackOrderScreen } from './screens/TrackOrderScreen';
import { ConsultScreen } from './screens/ConsultScreen';
import { BottomTabs } from './components/BottomTabs';
import { Tab } from './types';
import { AppProvider, useAppContext } from './AppContext';
import { Text } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

LogBox.ignoreLogs([
  'new NativeEventEmitter() was called with a non-null argument without the required `addListener` method.',
  'new NativeEventEmitter() was called with a non-null argument without the required `removeListeners` method.',
]);

// Inner App Component containing the Main Logic
const MainApp = () => {
  const [navStack, setNavStack] = useState<Tab[]>([Tab.Home]);
  const { toast } = useAppContext();

  const currentTab = navStack[navStack.length - 1];

  const handleNavigate = (tab: Tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNavStack(prev => [...prev, tab]);
  };

  const handleBack = () => {
    if (navStack.length > 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNavStack(prev => prev.slice(0, -1));
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, [navStack]);

  const renderScreen = () => {
    const props = {
      onNavigate: handleNavigate,
      onBack: handleBack,
    };

    switch (currentTab) {
      case Tab.Home:
        return <HomeScreen {...props} />;
      case Tab.Pharmacy:
        return <PharmacyScreen {...props} />;
      case Tab.LabTests:
        return <LabTestsScreen {...props} />;
      case Tab.PetCare:
        return <PetCareScreen {...props} />;
      case Tab.Profile:
        return <ProfileScreen onNavigate={handleNavigate} />;
      case Tab.Cart:
        return <CartScreen {...props} />;
      case Tab.Checkout:
        return <CheckoutScreen {...props} />;
      case Tab.OrderSuccess:
        return <OrderSuccessScreen {...props} />;
      case Tab.ProductDetails:
        return <ProductDetailScreen {...props} />;
      case Tab.LabDetails:
        return <LabDetailScreen {...props} />;
      case Tab.LabReports:
        return <LabReportsScreen {...props} />;
      case Tab.Appointments:
        return <AppointmentsScreen {...props} />;
      case Tab.TrackOrder:
        return <TrackOrderScreen {...props} />;
      case Tab.Categories:
        return <PharmacyScreen {...props} />;
      case Tab.Print:
        return <LabReportsScreen {...props} />;
      case Tab.Consult:
        return <ConsultScreen {...props} />;
      default:
        return <HomeScreen {...props} />;
    }
  };

  const shouldShowBottomTabs = ![
    Tab.Cart,
    Tab.Checkout,
    Tab.OrderSuccess,
    Tab.ProductDetails,
    Tab.LabDetails,
    Tab.LabDetails,
    // Tab.TrackOrder - Show tabs on TrackOrder now
  ].includes(currentTab);

  const handleTabPress = (tab: Tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNavStack([tab]);
  };

  return (
    <View style={styles.content}>
      {renderScreen()}
      {shouldShowBottomTabs && (
        <BottomTabs currentTab={currentTab} onTabChange={handleTabPress} />
      )}
    </View>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    import('@react-native-firebase/auth').then(auth => {
      const subscriber = auth.default().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppWrapper
          showSplash={showSplash}
          initializing={initializing}
          user={user}
        />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const AppWrapper = ({ showSplash, initializing, user }: any) => {
  const { toast, setUser } = useAppContext();

  // Sync Firebase Auth user to context FIRST
  useEffect(() => {
    if (user) {
      // Set the Auth user (with uid) to context
      setUser({ uid: user.uid, email: user.email, name: user.displayName || 'User' });
    } else {
      setUser(null);
    }
  }, [user]);

  // Listen for extra user details from Firestore
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            // Merge Auth data with Firestore data
            const dbData = doc.data();
            setUser((prev: any) => ({ ...prev, ...dbData }));
          }
        }, err => console.log('Firestore sync error:', err));

      return () => unsubscribe();
    }
  }, [user?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Global Toast */}
      {toast.visible && (
        <View style={styles.toastContainer}>
          <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
            {toast.type === 'success' ?
              <Text style={{ fontSize: 16, marginRight: 6 }}>✅</Text> :
              <Text style={{ fontSize: 16, marginRight: 6 }}>⚠️</Text>
            }
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </View>
      )}

      {showSplash || initializing ? (
        <SplashScreen />
      ) : !user ? (
        <AuthScreen onLogin={() => { }} />
      ) : (
        <MainApp />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  toastSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  toastError: {
    borderLeftWidth: 4,
    borderLeftColor: '#f87171',
  },
  toastText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
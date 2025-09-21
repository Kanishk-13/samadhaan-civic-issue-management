import React from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

// Compute the admin URL dynamically
const ADMIN_URL = (() => {
  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : 'localhost';
    return `http://${host}:5060/admin`;
  }
  // Native devices use the dev machine's LAN IP. Update if your IP changes.
  return 'http://10.12.75.192:5060/admin';
})();

export default function AdminScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.h1}>Admin Dashboard</Text>
        <Text style={styles.muted}>Opens the admin dashboard in a new browser tab.</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(ADMIN_URL)}>
          <Text style={styles.buttonText}>Open Admin</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <iframe title="admin" src={ADMIN_URL} style={{ border: '1px solid #e5e7eb', borderRadius: 12, width: '100%', height: '70vh' }} />
      </View>
    );
  }

  // On native (Expo Go), embed the admin site directly via WebView
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: ADMIN_URL }} startInLoadingState style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  muted: { color: '#64748b', marginBottom: 12 },
  button: { backgroundColor: '#667eea', padding: 12, borderRadius: 10, alignSelf: 'flex-start' },
  buttonText: { color: 'white', fontWeight: '700' },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { Platform } from 'react-native';

// TODO: Set your backend base URL (use your laptop IP on same WiFi), e.g. 'http://192.168.1.10:5001'
const BASE_URL = (() => {
  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : 'localhost';
    return `http://${host}:5001`;
  }
  return 'http://10.12.75.192:5001';
})();

export default function TrackScreen({ navigation }) {
  const [issueId, setIssueId] = useState('');
  const [issue, setIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/issues`);
      const list = await res.json();
      setIssues(list);
    } catch (e) {
      Alert.alert('Network error', e.message);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIssues();
    setRefreshing(false);
  };

  const track = async () => {
    if (!issueId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/issues`);
      const list = await res.json();
      const found = list.find((i) => i.issue_id === issueId.trim());
      if (!found) {
        Alert.alert('Not found', 'No issue found with that ID');
      } else {
        navigation.navigate('IssueDetails', { issue: found, baseUrl: BASE_URL });
      }
    } catch (e) {
      Alert.alert('Network error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.h1}>Track</Text>
      <TextInput placeholder="Enter Issue ID" style={styles.input} value={issueId} onChangeText={setIssueId} />
      <TouchableOpacity style={styles.btn} onPress={track}>
        <Text style={styles.btnText}>{loading ? 'Loading...' : 'Track'}</Text>
      </TouchableOpacity>

      {issue && (
        <View style={styles.card}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text style={styles.meta}>{issue.category} • {issue.priority} • {issue.status}</Text>
          <Text style={styles.metaSmall}>{issue.issue_id} • {issue.citizen_name} • {new Date(issue.created_at).toLocaleString()}</Text>
          <Text style={styles.desc}>{issue.description}</Text>
          <Text style={styles.metaSmall}>Department: {issue.assigned_department}</Text>
          <Text style={styles.metaSmall}>Address: {issue.address}</Text>
        </View>
      )}

      <Text style={[styles.h1, { marginTop: 16 }]}>All Reports</Text>
      {issues.map((it) => (
        <TouchableOpacity key={it.id} style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('IssueDetails', { issue: it, baseUrl: BASE_URL })}>
          <Text style={styles.title}>{it.title}</Text>
          <Text style={styles.meta}>{it.category} • {it.priority} • {it.status}</Text>
          <Text style={styles.metaSmall}>{it.issue_id} • {it.citizen_name} • {new Date(it.created_at).toLocaleString()}</Text>
          <Text style={styles.desc} numberOfLines={3}>{it.description}</Text>
          {it.address ? <Text style={styles.metaSmall}>Address: {it.address}</Text> : null}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  btn: { backgroundColor: '#667eea', padding: 12, borderRadius: 10, marginTop: 10 },
  btnText: { color: 'white', fontWeight: '700', textAlign: 'center' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginTop: 16, borderWidth: 1, borderColor: '#eef2ff' },
  title: { fontSize: 18, fontWeight: '700' },
  meta: { color: '#4b5563', marginTop: 2 },
  metaSmall: { color: '#9ca3af', marginTop: 2, fontSize: 12 },
  desc: { marginTop: 8, color: '#374151' },
});

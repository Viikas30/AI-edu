import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function ResultWidget({ loading, aiPara, metadata }) {
  if (loading) {
    return (
      <View style={styles.widget}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Generating NCERT Concept...</Text>
      </View>
    );
  }

  if (!aiPara && !metadata) {
    return (
      <View style={styles.widget}>
        <Text style={styles.noResult}>No NCERT concept generated.</Text>
      </View>
    );
  }

  return (
    <View style={styles.widget}>
      <Text style={styles.header}>AI-Generated Summary</Text>
      {metadata && (
        <View style={styles.metaBlock}>
          <Text style={styles.metaText}>Class: {metadata.class || 'N/A'}</Text>
          <Text style={styles.metaText}>Subject: {metadata.subject || 'N/A'}</Text>
          <Text style={styles.metaText}>Chapter: {metadata.chapter_name || 'N/A'}</Text>
          <Text style={styles.metaText}>Page: {metadata.page || 'N/A'}</Text>
        </View>
      )}
      <Text style={styles.contentSnippet}>{aiPara}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    minHeight: 120,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  noResult: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  metaBlock: {
    marginBottom: 10,
  },
  metaText: {
    fontSize: 15,
    color: '#555',
  },
  contentSnippet: {
    fontSize: 15,
    marginTop: 6,
    color: '#555',
    lineHeight: 22,
  },
});
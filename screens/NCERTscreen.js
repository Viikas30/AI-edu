import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, ScrollView, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';



const QDRANT_CLOUD_BASE_URL = 'https://1bcdfef2-22c6-44f9-a2fa-adc4a4ca5e4e.europe-west3-0.gcp.cloud.qdrant.io:6333';
const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.erRscERUav-m7n0_T5FbZkvCFakbTMlcuM5Rqu-Q038';
const COLLECTION_NAME = 'ncert-clas11-phy-vectors';

const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);

const searchVectors = async (vector, limit = 5) => {
  try {
    const response = await fetch(
      `${QDRANT_CLOUD_BASE_URL}/collections/${COLLECTION_NAME}/points/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': QDRANT_API_KEY,
        },
        body: JSON.stringify({
          vector,
          limit,
          with_payload: true,
          with_vectors: false,
        }),
      }
    );
    if (!response.ok) throw new Error(`Qdrant search error: ${response.status}`);
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Qdrant search failed:', error);
    throw error;
  }
};

const getTranscriptFromServer = async (videoId) => {
  console.log('Requesting transcript for videoId:', videoId);
  const response = await fetch(`http://192.168.31.192:5000/transcript/${videoId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to get transcript');
  const data = await response.json();
  // data is an array of lines, join to a single string
  return data.join(' ');
};

export default function SearchScreen() {
  const [queryText, setQueryText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  // Try to get videoId from route params if available
  const videoId = route.params?.videoId;

const getEmbeddingFromServer = async (text) => {
  const response = await fetch('http://192.168.31.192:3000/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to get embedding from server');
  }

  const embedding = await response.json();
  return embedding;
};

const handleTranscriptSearch = async () => {
    if (!videoId) {
      Alert.alert('No video', 'No videoId provided.');
      return;
    }
    setLoading(true);
    setSearchResults([]);
    try {
      const transcript = await getTranscriptFromServer(videoId);
      if (!transcript || transcript.length < 10) throw new Error('Transcript too short or missing');
      const embeddingArray = await getEmbeddingFromServer(transcript);
      if (!Array.isArray(embeddingArray) || embeddingArray.some(v => typeof v !== 'number' || isNaN(v))) {
        throw new Error('Invalid embedding array received from server');
      }
      const results = await searchVectors(embeddingArray, 5);
      setSearchResults(results);
    } catch (err) {
      console.error('Transcript search error:', err);
      Alert.alert('Transcript Search Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

// const handleSearch = async () => {
//   if (!queryText.trim()) {
//     Alert.alert('Input Error', 'Please enter a query.');
//     return;
//   }

//   setLoading(true);
//   setSearchResults([]);

//   try {
//     console.log('Requesting embedding from server...');
//     const embeddingArray = await getEmbeddingFromServer(queryText);
//     // console.log('Embedding:', embeddingArray, Array.isArray(embeddingArray), 'Length:', embeddingArray.length);

//     if (!Array.isArray(embeddingArray) || embeddingArray.some(v => typeof v !== 'number' || isNaN(v))) {
//       throw new Error('Invalid embedding array received from server');
//     }

//     const results = await searchVectors(embeddingArray, 5);
//     setSearchResults(results);
//   } catch (err) {
//     console.error('Search error:', err);
//     Alert.alert('Search Failed', err.message);
//   } finally {
//     setLoading(false);
//   }
// };
// ...existing code...


  return (
    <View style={styles.container}>
      <Text style={styles.title}>NCERT Search (Executorch)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your query"
        value={queryText}
        onChangeText={setQueryText}
        editable={!loading}
      />
      {/* <Button
        title={loading ? 'Searching...' : 'Search'}
        onPress={handleSearch}
        disabled={loading || !queryText.trim()}
      /> */}
      <Button
        title={loading ? 'Searching transcript...' : 'Search by Video Transcript'}
        onPress={handleTranscriptSearch}
        disabled={loading || !videoId}
        color="#28a745"
      />

      {loading && (
        <View style={styles.statusMessage}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Searching Qdrant...</Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((hit) => (
          <View key={hit.id} style={styles.resultItem}>
            <Text style={styles.resultHeader}>Score: {hit.score.toFixed(4)}</Text>
            <Text>Class: {hit.payload?.class || 'N/A'}</Text>
            <Text>Subject: {hit.payload?.subject || 'N/A'}</Text>
            <Text>Chapter: {hit.payload?.chapter || 'N/A'}</Text>
            <Text>Chapter name: {hit.payload?.chapter_name || 'N/A'}</Text>
            <Text>Page: {hit.payload?.page || 'N/A'}</Text>
            <Text style={styles.contentSnippet}>
              {hit.payload?.content?.slice(0, 300) + '...' || 'No content'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2c3e50',
  },
  input: {
    height: 55,
    borderColor: '#a0b0c0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  statusMessage: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 25,
  },
  resultItem: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 2,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#34495e',
  },
  contentSnippet: {
    fontSize: 14,
    marginTop: 10,
    color: '#555',
    lineHeight: 20,
  },
});

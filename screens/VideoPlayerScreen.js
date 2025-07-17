import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoRow from '../components/VideoRow';
import { channels } from '../data/channels';
import { getMultipleChannelsVideos } from '../services/youtubeService';
import ResultWidget from '../components/ResultWidget';


const fetchAIGeneratedPara = async ({ chapter }) => {
  const response = await fetch('http://192.168.31.192:3000/ncert-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({  chapter }),
  });
  if (!response.ok) throw new Error('Failed to get AI para');
  const data = await response.json();
  return data.para;
};

const getTranscriptFromServer = async (videoId) => {
  const response = await fetch(`http://192.168.31.192:5000/transcript/${videoId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to get transcript');
  const data = await response.json();
  return data.join(' ');
};

const getEmbeddingFromServer = async (text) => {
  const response = await fetch('http://192.168.31.192:3000/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to get embedding from server');
  return await response.json();
};

const searchVectors = async (vector, limit = 5) => {
  const QDRANT_CLOUD_BASE_URL = 'https://1bcdfef2-22c6-44f9-a2fa-adc4a4ca5e4e.europe-west3-0.gcp.cloud.qdrant.io:6333';
  const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.erRscERUav-m7n0_T5FbZkvCFakbTMlcuM5Rqu-Q038';
  const COLLECTION_NAME = 'ncert-clas11-phy-vectors';
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
};

const VideoPlayerScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const [relatedVideos, setRelatedVideos] = React.useState([]);
  const [ncertLoading, setNcertLoading] = React.useState(true);
  const [aiPara, setAiPara] = React.useState(null);
  const [retrievedMeta, setRetrievedMeta] = React.useState(null);

  React.useEffect(() => {
    const fetchRelated = async () => {
      const all = await getMultipleChannelsVideos(channels);
      const flat = all.flatMap((c) => c.videos).filter(v => v.id !== video.id);
      setRelatedVideos(flat.slice(0, 5));
    };
    fetchRelated();
  }, [video.id]);

  React.useEffect(() => {
    let cancelled = false;
    const fetchNcert = async () => {
      setNcertLoading(true);
      setAiPara(null);
      setRetrievedMeta(null);
      try {
        const transcript = await getTranscriptFromServer(video.id);
        if (!transcript || transcript.length < 10) throw new Error('Transcript too short or missing');
        const embeddingArray = await getEmbeddingFromServer(transcript);
        if (!Array.isArray(embeddingArray) || embeddingArray.some(v => typeof v !== 'number' || isNaN(v))) {
          throw new Error('Invalid embedding array received from server');
        }
        const results = await searchVectors(embeddingArray, 5);
        if (results && results.length > 0) {
          const payload = results[0].payload || {};
          setRetrievedMeta(payload);
          
          const chapterName = payload.chapter_name;
          const aiParaResult = await fetchAIGeneratedPara({
            
            chapter: chapterName,
          });
          if (!cancelled) setAiPara(aiParaResult);
        }
      } catch (err) {
        if (!cancelled) setAiPara(null);
        if (!cancelled) setRetrievedMeta(null);
        console.error('NCERT retrieval error:', err);
      } finally {
        if (!cancelled) setNcertLoading(false);
      }
    };
    fetchNcert();
    return () => { cancelled = true; };
  }, [video.id]);

  return (
    <ScrollView style={styles.container}>
      <YouTubePlayer videoUrl={video.url} />
      <Text style={styles.title}>{video.title}</Text>

      {/* NCERT Result Widget: show AI para and metadata */}
      <ResultWidget loading={ncertLoading} aiPara={aiPara} metadata={retrievedMeta} />

      <Text style={styles.subheading}>Recommended Videos</Text>
      <VideoRow
        videos={relatedVideos}
        title=""
        onSelect={(selectedVideo) => {
          navigation.push('Watch', { video: selectedVideo });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
});

export default VideoPlayerScreen;
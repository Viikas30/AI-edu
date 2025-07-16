import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoRow from '../components/VideoRow';
import { channels } from '../data/channels';
import { getMultipleChannelsVideos } from '../services/youtubeService';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native';

const VideoPlayerScreen = ({ route , navigation}) => {
  const { video } = route.params;
  const [relatedVideos, setRelatedVideos] = React.useState([]);

  React.useEffect(() => {
    const fetchRelated = async () => {
      const all = await getMultipleChannelsVideos(channels);
      const flat = all.flatMap((c) => c.videos).filter(v => v.id !== video.id);
      setRelatedVideos(flat.slice(0, 5)); // Show 5 recommendations
    };
    fetchRelated();
  }, [video.id]);

  return (
    <ScrollView style={styles.container}>
      <YouTubePlayer videoUrl={video.url} />
      <Text style={styles.title}>{video.title}</Text>

      <Text style={styles.subheading}>Recommended Videos</Text>
      <VideoRow
  videos={relatedVideos}
  title=""
  onSelect={(selectedVideo) => {
    navigation.push('Watch', { video: selectedVideo });
  }}
/>
<Button
  title="Show NCERT Concept"
  onPress={() =>
    navigation.navigate('NCERTCaption', {
      videoTitle: video.title,
    })
  }
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

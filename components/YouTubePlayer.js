import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const YouTubePlayer = ({ videoUrl }) => {
  // Extract video ID from URL
  const match = videoUrl.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;
  if (!videoId) return null;

  const { width } = Dimensions.get('window');
  const height = (width * 9) / 16;

  return (
    <View style={styles.container}>
      <WebView
        style={{ width: '100%', height }}
        javaScriptEnabled
        domStorageEnabled
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        allowsFullscreenVideo
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    marginBottom: 16,
  },
});

export default YouTubePlayer;
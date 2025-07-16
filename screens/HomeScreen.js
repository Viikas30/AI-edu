import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { channels } from '../data/channels';
import { getMultipleChannelsVideos } from '../services/youtubeService';
import VideoRow from '../components/VideoRow';
import * as _ from 'lodash';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [channelVideos, setChannelVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      const allChannelVideos = await getMultipleChannelsVideos(channels);
      setChannelVideos(allChannelVideos);

      // Select 5 random videos for the top section
      const all = allChannelVideos.flatMap((c) => c.videos);
      const randomVideos = _.sampleSize(all, 5);
      setTopVideos(randomVideos);

      setLoading(false);
    };

    loadVideos();
  }, []);

  const handleVideoSelect = (video) => {
  navigation.navigate('Watch', { video });
};

  if (loading) return <ActivityIndicator size="large" color="blue" style={{ marginTop: 60 }} />;

  return (
    <FlatList
  ListHeaderComponent={
    <>
      <VideoRow title="Top Picks for You" videos={topVideos} onSelect={handleVideoSelect} />
      {channelVideos.map((channel) => (
        <VideoRow
          key={channel.channelName}
          title={channel.channelName}
          videos={channel.videos}
          onSelect={handleVideoSelect}
        />
      ))}
    </>
  }
  data={[]} // FlatList needs data, even if empty
  renderItem={null}
  refreshing={loading}
  onRefresh={async () => {
    setLoading(true);
    const allChannelVideos = await getMultipleChannelsVideos(channels);
    setChannelVideos(allChannelVideos);
    setTopVideos(_.sampleSize(allChannelVideos.flatMap((c) => c.videos), 5));
    setLoading(false);
  }}
/>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default HomeScreen;

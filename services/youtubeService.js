import axios from 'axios';

const API_KEY = 'AIzaSyCn0diGJCGuIa77ieG03hYU2w8XcD3O-Bk';
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const getVideosFromChannel = async (channelId, channelName, maxResults = 10) => {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: API_KEY,
        channelId,
        part: 'snippet',
        order: 'date',
        maxResults,
        type: 'video',
      },
    });

    return res.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelName, 
    }));
  } catch (err) {
    console.error('YouTube fetch error:', err);
    return [];
  }
};

export const getMultipleChannelsVideos = async (channelList) => {
  const allVideos = [];
  for (const channel of channelList) {
    const videos = await getVideosFromChannel(channel.id, channel.name, 10); // pass name
    allVideos.push({ channelName: channel.name, videos });
  }
  return allVideos;
};

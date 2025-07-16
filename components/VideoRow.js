import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const VideoRow = ({ title, videos, onSelect }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <FlatList
        data={videos}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <View style={styles.card}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    width: 160,
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: 90,
    borderRadius: 8,
  },
  title: {
    fontSize: 13,
    marginTop: 4,
  },
});

export default VideoRow;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const VerticalVideoList = ({ videos, onSelect }) => {
  return (
    <View>
      {videos.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onSelect(item)}
          style={styles.item}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbnail: {
    width: 120,
    height: 70,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VerticalVideoList;

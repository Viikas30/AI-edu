import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import SearchScreen from '../screens/NCERTscreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Watch" component={VideoPlayerScreen} />
      <Stack.Screen name="NCERTCaption" component={SearchScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

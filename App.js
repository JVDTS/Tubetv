import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen'; // Your main screen
import FormatSelection from './FormatSelection'; // Your format selection screen
import ErrorScreen from './ErrorScreen'; // The error screen
import VideoInfoScreen from './VideoInfoScreen'; // Import the VideoInfoScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="FormatSelection" component={FormatSelection} />
        <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
        <Stack.Screen name="VideoInfoScreen" component={VideoInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

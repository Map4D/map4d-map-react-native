// import * as React from 'react';
import React, { useState } from 'react'
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Home';
import SelectLocationScreen from './SelectLocation';
import DirectionsScreen from './Directions';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
        <Stack.Screen name="Directions" component={DirectionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

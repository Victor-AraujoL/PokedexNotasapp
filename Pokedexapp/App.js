import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { criarTabelaFavoritos } from './src/database/database';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    criarTabelaFavoritos();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Pokemon' }}
        />
        <Stack.Screen
          name="Detalhes"
          component={DetailsScreen}
          options={{ title: 'Detalhes do Pokemon' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

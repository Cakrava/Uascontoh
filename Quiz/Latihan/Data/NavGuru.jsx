// NavGuru.jsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DataGuru from './DataGuru';
import FormTambah from './FormTambah';
import {StatusBar} from 'react-native';
const Stack = createNativeStackNavigator();

export default function NavGuru() {
  return (
    //iyaa paham
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#332941"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataGuru">
        <Stack.Screen
          name="DataGuru"
          component={DataGuru}
          options={{
            headerTitle: 'Data Guru',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#332941',
            },
          }}
        />

        <Stack.Screen
          name="FormTambah"
          component={FormTambah}
          options={{
            headerTitle: 'Tambah Guru',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#332941',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

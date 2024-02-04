import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FormInput from './FormInput';
import DataJadwal from './DataJadwal';

import {StatusBar} from 'react-native';
export default function NavJadwal() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#332941"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataJadwal">
        <Stack.Screen
          name="FormInput"
          component={FormInput}
          options={{
            headerTitle: 'Input Jadwal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#332941',
            },
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="DataJadwal"
          component={DataJadwal}
          options={{
            headerTitle: 'Data Jadwal',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#332941',
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
}

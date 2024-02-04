import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import Screens

import LoginScreen from './Login';
import Index from './Index';
import DataGuru from './Data/DataGuru';
import NavGuru from './Data/NavGuru';
const stack = createNativeStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    //Periksa Token saat aplikasi dimuat
    const checkTokenUser = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      setUserToken(userToken);
    };
    checkTokenUser();
  }, []);
  const handleSetUserToken = token => {
    setUserToken(token);
  };

  return (
    <NavigationContainer>
      <stack.Navigator>
        {userToken == null ? (
          <stack.Screen name="Login" options={{headerShown: false}}>
            {props => (
              <LoginScreen {...props} setUserToken={handleSetUserToken} />
            )}
          </stack.Screen>
        ) : (
          <>
            <stack.Screen name="Index" options={{headerShown: false}}>
              {props => <Index {...props} setUserToken={setUserToken} />}
            </stack.Screen>
            <stack.Screen
              name="Guru"
              component={NavGuru}
              options={{headerShown: false}}
            />
          </>
        )}
      </stack.Navigator>
    </NavigationContainer>
  );
};
export default App;

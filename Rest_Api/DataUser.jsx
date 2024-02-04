import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Paket ikon yang berbeda

export default function DataUser({setUserToken}) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const cardScale = new Animated.Value(1);

  useEffect(() => {
    // Mengambil nama pengguna
    const fetchUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'Pengguna');
    };

    fetchUserData();
  }, []);

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah anda yakin ingin logout?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleLogout()},
      ],
      {cancelable: false},
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      navigation.navigate('Login');
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const animateCard = () => {
    Animated.timing(cardScale, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {transform: [{scale: cardScale}]}]}>
        <Text style={styles.userName}>{userName}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            animateCard();
            confirmLogout();
          }}>
          <Text style={styles.logoutText}>Logout</Text>
          <Icon name="door-open" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#332941',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
});

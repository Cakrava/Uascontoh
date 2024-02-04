import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Matkul() {
  const [dataMatkul, setDataMatkul] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Buat fungsi untuk memanggil api
  const fetchDataMatkul = async (pageNumber = 1, searchQuery = search) => {
    setLoading(true);
    setError('');

    try {
      let token = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${apiUrl}matakuliah?page=${pageNumber}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      setPage(pageNumber);
      setLastPage(json.meta.last_page);
      setDataMatkul(
        pageNumber === 1 ? json.data : [...dataMatkul, ...json.data],
      );
    } catch (error) {
      setError('Tidak bisa mengambil data: ${error}');
    } finally {
      setLoading(false);
      if (pageNumber === 1) setRefreshing(false);
    }
  };
  const handleSearch = () => {
    setIsSearching(true);
    fetchDataMatkul(1, search);
  };
  const clearSearch = () => {
    setIsSearching(false);
    fetchDataMatkul(1, '');
    setSearch('');
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchDataMatkul(1, search).finally(() => setRefreshing(false));
  };

  let token;
  useEffect(() => {
    const initializeData = async () => {
      let token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        await fetchDataMatkul();
      }
    };

    initializeData();
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.dataAdded) {
        initializeData();
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.dataAdded]);

  const renderItemMatkul = ({item}) => {
    const showDetailMatkul = () => {
      navigation.navigate('DetailMatkul', {
        kdmatkul2010008: item.kdmatkul2010008,
      });
    };
    return (
      <View style={styles.item}>
        <Text style={styles.titleNim}>{item.namamat2010008}</Text>
        <Text style={styles.text}>{item.kdmatkul2010008}</Text>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={showDetailMatkul}>
          <Icon name="arrow-redo" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari berdasarkan KK Matkul atau Nama Matkul"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />
      {isSearching && (
        <TouchableOpacity onPress={() => clearSearch()} style={styles.button}>
          <Text style={styles.buttonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
      {loading && page === 1 && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={dataMatkul}
        renderItem={renderItemMatkul}
        keyExtractor={item => item.kdmatkul2010008}
        extraData={loading || error}
        onEndReached={() => {
          if (!loading && page < lastPage) {
            fetchDataMatkul(page + 1);
          }
        }}
        onEndReachedThreshold={0.5} // Atur sesuai kebutuhan
        ListFooterComponent={() =>
          !loading || page === 1 ? null : (
            <ActivityIndicator size="large" color="#860A35" />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('FormTambah');
        }}>
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEFEF', // Warna latar belakang yang lebih lembut
  },
  searchInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 4,
    shadowRadius: 5,
  },
  titleNim: {
    fontSize: 22,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: '#555555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#332941',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  detailButton: {
    position: 'absolute',
    right: 10,
    top: 20,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#332941',
    borderRadius: 30,
    elevation: 8,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
  },
});

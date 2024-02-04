import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../config';

export default function DataJadwal() {
  const navigation = useNavigation();
  const route = useRoute();
  const [dataJadwal, setDataJadwal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataJadwal = async (pageNumber = 1, searchQuery = search) => {
    setLoading(true);
    setError('');

    try {
      let token = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${apiUrl}jadwal?page=${pageNumber}&search=${searchQuery}`,
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
      setLastPage(json.meta);

      setDataJadwal(
        pageNumber === 1 ? json.data : [...dataJadwal, ...json.data],
      );
    } catch (error) {
      setError(`Gagal Mengambil Data: ${error}`);
    } finally {
      setLoading(false);
      if (pageNumber === 1) setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      let token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        await fetchDataJadwal();
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

  const handleSearch = () => {
    fetchDataJadwal(1, search);
  };

  const clearSearch = () => {
    setSearch('');
    fetchDataJadwal(1, '');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDataJadwal(1, search).finally(() => setRefreshing(false));
  };

  const renderItemJadwal = ({item}) => {
    const bukadetail = () => {
      navigation.navigate('DetailJadwal', {
        kodejadwal_2010008: item.kodejadwal_2010008,
        foto: item.foto,
      });
    };

    return (
      <TouchableOpacity style={styles.item}>
        <View style={styles.container}>
          <Text style={styles.item}>Dosen: {item.nama_dosen}</Text>
          <Text style={styles.item}>Kode: {item.kodejadwal_2010008}</Text>
          <Text style={styles.item}>
            Waktu: {item.hari_2010008} | {item.jamawal_2010008} -{' '}
            {item.jamakhir_2010008}
          </Text>
          <Text style={styles.item}>Ruang: {item.ruangan_2010008}</Text>
          <Text style={styles.item}>Matakuliah: {item.nama_2010008}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari berdasarkan Kode Jadwal"
        value={search}
        onChangeText={text => setSearch(text)}
        onSubmitEditing={handleSearch}
      />
      {search !== '' && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="close-outline" size={20} color="red" />
        </TouchableOpacity>
      )}
      {loading && page === 1 && (
        <ActivityIndicator
          size="large"
          color="#860A35"
          style={styles.loading}
        />
      )}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={dataJadwal}
        renderItem={renderItemJadwal}
        keyExtractor={item => item.kodejadwal_2010008}
        extraData={loading || error}
        onEndReached={() => {
          if (!loading) {
            fetchDataJadwal(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
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
          navigation.navigate('FormInput');
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

    borderBottomWidth: 1,
    borderRadius: 20,
    borderLeftWidth: 0.2,
    borderRightWidth: 0.2,
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
    // },
    // item: {
    //   backgroundColor: '#FFFFFF',
    //   padding: 15,
    //   borderRadius: 10,
    //   marginVertical: 8,
    //   elevation: 4,
    //   shadowRadius: 5,
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
    backgroundColor: '#0B60B0',
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
    backgroundColor: '#0B60B0',
    borderRadius: 30,
    elevation: 8,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
  },
  // container: {
  //   backgroundColor: '#f2f2f2',
  //   padding: 10,
  //   margin: 10,
  // },
  item: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen({ navigation }) {
  const [memoList, setMemoList] = useState([]);

  const handleCreateShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  // AsyncStorage에서 shopping_data 불러오기 (여러 개)
  const getShoppingData = async () => {
    try {
      const data = await AsyncStorage.getItem('shopping_data');
      if (data) {
        const arr = JSON.parse(data);
        console.log(arr)
        setMemoList(Array.isArray(arr) ? arr : [arr]);
      } else {
        setMemoList([]);
      }
    } catch (e) {
      setMemoList([]);
    }
  };

  useEffect(() => {
    getShoppingData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>EasyJang</Text>
      </View>
      {memoList.length > 0 ? (
        <>
          {memoList.map((memo, idx) => (
            <View key={idx} style={styles.memoCard}>
              <Text style={styles.memoText}>{memo.title || '제목 없음'}</Text>
              <Text style={styles.memoDate}>{memo.createdAt ? new Date(memo.createdAt).toLocaleString() : ''}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addMemoButton}
            onPress={handleCreateShoppingList}
          >
            <AntDesign name="pluscircle" size={30} color="#F2FFF0" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateShoppingList}
        >
          <Text style={styles.buttonText}>장바구니 만들기</Text>
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FFF0',
    alignItems: 'center',
    paddingTop: 50,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E4633',
  },
  createButton: {
    backgroundColor: '#88C399',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#2E4633',
    fontWeight: 'bold',
  },
  memoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E4633',
  },
  memoDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  addMemoButton: {
    backgroundColor: '#C8F7C5',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
}); 
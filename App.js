import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function CustomTitleInput({ navigation, route }) {
  const [title, setTitle] = useState(route.params?.title || '');
  const shoppingList = route.params?.lines || [];

  const handleChange = (text) => {
    setTitle(text);
    navigation.setParams({ title: text });
  };

  const handleSave = async () => {
    const data = {
      title: title,
      list: shoppingList,
      createdAt: new Date().toISOString(),
    };
    try {
      await AsyncStorage.setItem('shopping_data', JSON.stringify(data));
      console.log('저장된 데이터:', data);
      navigation.navigate('Home');
    } catch (e) {
      console.error('저장 실패:', e);
    }
  };

  return (
    <View style={styles.titleRow}>
      <TextInput
        value={title}
        onChangeText={handleChange}
        placeholder="제목을 입력하세요"
        style={styles.titleInput}
      />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ShoppingList" 
          component={ShoppingListScreen} 
          options={({ navigation, route }) => ({
            headerTitle: (props) => <CustomTitleInput navigation={navigation} route={route} {...props} />, 
            headerStyle: {
              backgroundColor: '#F2FFF0',
            },
            headerTintColor: '#2E4633',
            headerTitleAlign: 'left',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E4633',
    backgroundColor: 'transparent',
    minWidth: 120,
    maxWidth: 200,
  },
  saveButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#C8F7C5',
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#2E4633',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


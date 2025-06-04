import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShoppingListScreen() {
  const navigation = useNavigation();
  // 각 줄의 텍스트를 배열로 관리
  const [lines, setLines] = useState(['']);
  const [title, setTitle] = useState('');
  const inputRefs = useRef([]);

  // 저장 버튼 클릭 시 shopping_data 배열에 append
  const handleSave = async () => {
    const data = {
      title: title || '제목 없음',
      list: lines,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = await AsyncStorage.getItem('shopping_data');
      let arr = [];
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          arr = [...parsed, data];
          await AsyncStorage.setItem('shopping_data', JSON.stringify(arr));
          console.log('저장된 데이터:', arr);
        } catch (e) {
          console.log(e)
        }
      }else{
        arr = [data];
        await AsyncStorage.setItem('shopping_data', JSON.stringify(arr));
        console.log('저장된 데이터:', arr);
      }
      navigation.navigate('Home');
    } catch (e) {
      console.error('저장 실패:', e);
    }
  };
  

  // 텍스트 변경 핸들러
  const handleChangeText = (text, index) => {
    if (text === '') {
      // 줄이 1개 이상일 때만 삭제
      if (lines.length > 1) {
        setLines(prev => {
          const newLines = prev.filter((_, i) => i !== index);
          // 삭제 후 포커스 이동
          setTimeout(() => {
            if (inputRefs.current[index - 1]) {
              inputRefs.current[index - 1].focus();
            } else if (inputRefs.current[index]) {
              inputRefs.current[index].focus();
            }
          }, 100);
          return newLines;
        });
      } else {
        // 마지막 한 줄은 비우기만
        setLines(['']);
      }
    } else {
      setLines(prev => prev.map((item, i) => (i === index ? text : item)));
    }
  };

  // 다음 입력 필드로 이동하고 필요한 경우 새 줄 추가
  const focusNextInput = (index) => {
    if (index === lines.length - 1) {
      setLines(prev => [...prev, '']);
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }, 100);
    } else if (index < lines.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 최대 25줄 제한
  const visibleLines = lines.slice(0, 25);

  useEffect(() => {
    if (navigation && navigation.setParams) {
      navigation.setParams({ lines });
    }
  }, [lines]);

  return (
    <View style={styles.noteContainer}>
      {/* <TextInput
        style={styles.titleInput}
        placeholder="제목을 입력하세요"
        placeholderTextColor="#6B7F72"
        value={title}
        onChangeText={setTitle}
      /> */}
      <ScrollView style={styles.scrollView}>
        {visibleLines.map((text, index) => (
          <View key={index} style={styles.line}>
            <View style={styles.bulletPoint} />
            <TextInput
              style={styles.lineInput}
              placeholder={index === 0 ? "여기에 구매할 항목을 입력하세요..." : ""}
              placeholderTextColor="#6B7F72"
              ref={ref => (inputRefs.current[index] = ref)}
              blurOnSubmit={false}
              returnKeyType="next"
              value={text}
              onChangeText={t => handleChangeText(t, index)}
              onSubmitEditing={() => focusNextInput(index)}
            />
            <View style={styles.lineUnderline} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    backgroundColor: '#F2FFF0',
    padding: 10,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E4633',
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#C5E1A5',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 16,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
  },
  bulletPoint: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#88C399', 
    marginRight: 8,
  },
  lineInput: {
    flex: 1,
    fontSize: 20,
    color: '#2E4633',
    fontWeight: 'bold',
    padding: 0,
    height: 24,
  },
  lineUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C5E1A5',
  },
  saveButton: {
    backgroundColor: '#C8F7C5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#2E4633',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 
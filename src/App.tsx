import React, {useCallback, useState} from 'react';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Config from 'react-native-config';
import {
  FunctionDeclarationSchemaType,
  GoogleGenerativeAI,
} from '@google/generative-ai';

const API_KEY: any | string = Config.GEMINI_AI_KEY;

function App() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
  const [prompt, setPromp] = useState('');
  const [listResult, setListResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const onGenerate = useCallback(async () => {
    try {
      const resultObj: any = {};
      if (prompt.length === 0) {
        return false;
      }
      setLoading(true);

      let requestObj = {
        name: 'Anda',
        result: prompt,
      };

      setListResult(o => [...o, requestObj]);

      // result from Gemini
      const result = await model.generateContent(prompt);
      const response = result.response;
      const resultText: string = response.text();
      resultObj.name = 'AI Bot';
      resultObj.request = prompt;
      resultObj.result = resultText;
      console.log(prompt);
      console.log(resultText);
      setListResult(o => [...o, resultObj]);
      setPromp('');
      setLoading(false);
    } catch (error) {
      console.log('Error: ', error);
      setLoading(false);
    }
  }, [model, prompt]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text style={styles.title}>Google Gemini AI</Text>
      </View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={listResult}
        renderItem={({item}) => (
          <View style={styles.itemWrap}>
            <View style={styles.itemImg} />
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item?.name}</Text>
              <View style={styles.result}>
                <Text style={styles.resultText}>
                  {item?.result
                    .split(/\*\*(.*?)\*\*/g)
                    .map((text: string, index: number) => {
                      console.log(index, text);

                      if (index % 2 === 0) {
                        return text;
                      }
                      return (
                        <Text key={index} style={styles.bold}>
                          {text}
                        </Text>
                      );
                    })}
                </Text>
              </View>
            </View>
          </View>
        )}
        style={styles.body}
        contentContainerStyle={styles.bodyInside}
        showsVerticalScrollIndicator={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.footer}>
          <TextInput
            placeholder="Tuliskan disini"
            style={styles.textInput}
            value={prompt}
            editable={!loading}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#999'}
            selectionColor={'#000'}
            onChangeText={setPromp}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={onGenerate}>
            {!loading ? (
              <Text style={styles.buttonText}>Generate</Text>
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontFamily: 'Pacifico Regular',
    textAlign: 'center',
    fontSize: 20,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 16,
  },
  bodyInside: {
    padding: 16,
  },
  textInput: {
    fontFamily: 'Montserrat Regular',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  button: {
    backgroundColor: 'brown',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat Bold',
  },
  result: {
    backgroundColor: '#f7f1e4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 2,
  },
  resultText: {
    fontFamily: 'Montserrat Regular',
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  bold: {
    fontFamily: 'Montserrat Bold',
    fontSize: 14,
  },
  name: {
    fontFamily: 'Montserrat Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  itemWrap: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  itemImg: {
    marginRight: 8,
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
  },
});

export default App;

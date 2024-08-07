import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Config from 'react-native-config';
import {GoogleGenerativeAI} from '@google/generative-ai';
import GradientText from 'react-native-gradient-texts';
import {Footer} from './components/Footer';
import {EmptyState} from './components/EmptyState';

const windowWidth = Dimensions.get('window').width;

const API_KEY: any | string = Config.GEMINI_AI_KEY;
const geminiIcon = require('./assets/images/google-gemini-icon.png');
const boyIcon = require('./assets/images/boy.png');

function App() {
  const refScroll = useRef(null);
  const refInput = useRef(null);
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  const [prompt, setPromp] = useState('');
  const [listResult, setListResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      refInput.current && refInput.current.focus();
    });

    return () => {
      task.cancel();
    };
  }, []);

  useEffect(() => {
    let delay: any = null;
    const task = InteractionManager.runAfterInteractions(() => {
      if (listResult.length > 2) {
        delay = setTimeout(() => {
          refScroll.current &&
            refScroll.current.scrollToItem({
              animated: true,
              item: listResult[listResult.length - 1],
              viewPosition: 0,
            });
        }, 500);
      }
    });

    return () => {
      task.cancel();
      delay && clearTimeout(delay);
    };
  }, [listResult]);

  const onGenerate = useCallback(() => {
    const resultObj: any = {};
    try {
      requestAnimationFrame(async () => {
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
        resultObj.result = resultText;
        setListResult(o => [...o, resultObj]);
        setPromp('');
        setLoading(false);
      });
    } catch (error) {
      console.log('Error: ', error);
      resultObj.name = 'AI Bot';
      resultObj.result =
        "I don't understand what you wrote. Please try again later!";
      setListResult(o => [...o, resultObj]);
      setLoading(false);
    }
  }, [model, prompt]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />

      <View style={styles.header}>
        <GradientText
          text={'Google Gemini AI'}
          fontSize={20}
          isGradientFill
          isGradientStroke
          width={windowWidth}
          style={styles.title}
          locations={{x: windowWidth / 2, y: 25}}
          gradientColors={['#2623c2', '#d91434']}
          fontFamily={'Montserrat Regular'}
        />
      </View>
      <FlatList
        ref={refScroll}
        keyExtractor={(item, index) => index.toString()}
        data={listResult}
        removeClippedSubviews={false}
        renderItem={({item}) => (
          <View
            style={[
              styles.itemWrap,
              item?.name === 'Anda' && {
                backgroundColor: 'transparent',
              },
            ]}>
            <View
              style={[
                styles.itemImg,
                item?.name === 'Anda' && {backgroundColor: '#ddd'},
                item?.name === 'Anda' && {borderColor: '#bfbfbf'},
              ]}>
              {item?.name === 'Anda' ? (
                <Image source={boyIcon} style={{width: 24, height: 24}} />
              ) : (
                <Image source={geminiIcon} style={{width: 24, height: 24}} />
              )}
            </View>
            <View style={{flex: 1, marginTop: 10}}>
              {/* <Text style={styles.name}>{item?.name}</Text> */}
              <View style={styles.result}>
                <Text style={styles.resultText}>{item.result}</Text>
              </View>
            </View>
          </View>
        )}
        style={styles.body}
        contentContainerStyle={styles.bodyInside}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={<EmptyState />}
      />
      <Footer
        ref={refInput}
        value={prompt}
        onChangeText={setPromp}
        onSend={onGenerate}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    maxHeight: 50,
  },
  header: {
    maxHeight: 50,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
    paddingTop: 16,
  },
  body: {
    flex: 1,
    padding: 8,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  bodyInside: {
    padding: 16,
  },
  result: {},
  resultText: {
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
    backgroundColor: 'rgba(184, 32, 214,.05)',
    borderRadius: 16,
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemImg: {
    marginRight: 8,
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: 'rgba(79, 53, 212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(184, 32, 214,0.3)',
    borderWidth: 2,
  },
});

export default App;

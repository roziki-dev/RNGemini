import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const windowHeight = Dimensions.get('window').height;

export const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Kok Sepi yah? 🤔 Ayo mulai tanyakan sesuatu!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginHorizontal: 24,
  },
});

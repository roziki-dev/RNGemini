import React, {forwardRef} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface iFooter {
  onSend: () => void;
  onChangeText: (v: string) => void;
  value: string;
  loading: boolean;
}

export const Footer = forwardRef(
  ({onSend, onChangeText, value, loading}: iFooter, refs) => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.footer}>
          <View style={styles.textInputWrap}>
            {/* Button Image */}
            <TouchableOpacity
              disabled={loading}
              style={styles.buttonImg}
              onPress={onSend}>
              <Icon name="image" size={20} color="#444" />
            </TouchableOpacity>

            {/* text input */}
            <TextInput
              ref={refs}
              placeholder="Ada yang bisa saya bantu?"
              style={styles.textInput}
              value={value}
              editable={!loading}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'#999'}
              selectionColor={'#000'}
              onChangeText={onChangeText}
              autoComplete="off"
              autoCorrect={false}
              multiline={false}
            />
          </View>

          {/* Button Send */}
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={onSend}>
            {!loading ? (
              <Icon name="send" size={24} color="#fff" />
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonImg: {
    backgroundColor: '#ddd',
    padding: 12,
    marginRight: 10,
    borderRadius: 100,
  },
  textInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    padding: 4,
  },
});

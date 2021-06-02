import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colorPalette } from './assets/colors'
import { clipboard } from './assets/images'
import Task from './components/task'

export default function App() {

  const [inputText, setInputText] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('https://4ugzvhfkph.execute-api.eu-west-2.amazonaws.com/dev/todos')
      .then((res) => res.json())
      .then((json) => setTodos(json.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())))
      .catch((error) => console.error(error))
  }, [])

  const inputTextHandler = (text) => {
    setInputText(text);
  };

  const submitTodoHandler = () => {
    if (inputText) {
      fetch('https://4ugzvhfkph.execute-api.eu-west-2.amazonaws.com/dev/todos', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: inputText })
      })
        .then(() => {
          fetch('https://4ugzvhfkph.execute-api.eu-west-2.amazonaws.com/dev/todos')
            .then((res) => res.json())
            .then((json) => setTodos(json.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())))
            .catch((error) => console.error(error))
        })
        .catch((error) => console.error(error))
    }
    setTodos([...todos]);
    setInputText("");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>

          <View style={styles.items}>
            {
              todos.map((todo) => (
                <Task setTodos={setTodos} todo={todo} todos={todos} key={todo.id} />
              ))
            }
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}
        >
          <TextInput value={inputText} onChangeText={text => inputTextHandler(text)} style={styles.input} placeholder={'Write a Task'} />

          <TouchableOpacity onPress={() => submitTodoHandler()}>
            <View style={styles.addWrapper}>
              <Image style={styles.addImage} source={clipboard} />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <StatusBar style="dark" />

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.secondary,
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colorPalette.white,
    borderRadius: 60,
    borderColor: colorPalette.dark,
    borderWidth: 1,
    width: '70%'
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: colorPalette.white,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorPalette.dark,
    borderWidth: 1
  },
  addImage: {
    width: 26,
    height: 26
  }
});

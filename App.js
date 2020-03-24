import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { withAuthenticator } from "aws-amplify-react-native";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./src/graphql/mutations";
import { listTodos } from "./src/graphql/queries";
import theme from "./theme.js";

const initialState = { name: "", description: "" };

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      // @ts-ignore
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput("name", val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput("description", val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button title="Create Todo" onPress={addTodo} />
      {todos.map((todo, index) => (
        <View key={todo.id ? todo.id : index} style={styles.todo}>
          <Text style={styles.todoName}>{todo.name}</Text>
          <Text>{todo.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  todo: { marginBottom: 15 },
  input: { height: 50, backgroundColor: "#ddd", marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 }
});

const Config = {
  header: "True Care Sign Up",
  hideAllDefaults: true,
  defaultCountryCode: "1",
  signUpFields: [
    {
      label: "Name",
      key: "username",
      required: true,
      displayOrder: 1,
      type: "string"
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 2,
      type: "password"
    },
    {
      label: "Email",
      key: "email",
      required: true,
      displayOrder: 3,
      type: "string"
    },
    {
      label: "PhoneNumber",
      key: "phone_number",
      required: true,
      displayOrder: 4,
      type: "string"
    },
    {
      label: "Date of Birth",
      key: "DOB",
      required: true,
      displayOrder: 5,
      type: "string"
    }
  ]
};

export default withAuthenticator(App, true, [], null, theme, Config);

import { createContext, useState, useEffect, useContext } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { data } from "../db";

const TodolistContext = createContext();

export function TodolistProvider(props) {
  const [todos, setTodos] = useState(data);
  const [todosFiltered, setTodosFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [formOpened, openForm] = useState(false);
  const [payloadAtForm, setPayloadAtForm] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setTodosFiltered(
      todos.filter((todo) => {
        if (filter === "DONE") {
          return todo.done;
        }
        if (filter === "PENDING") {
          return !todo.done;
        }
        return todo;
      })
    );
  }, [todos, filter]);

  const addTodo = (todo) => {
    setTodos((prev) => [...prev, { ...todo, id: todos.length + 1 }]);
    showNotification({
      title: "To Do List",
      message: "To Do was added!",
      icon: <Check />,
      color: "teal",
    });
  };

  const updateTodo = (id, data) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        return todo.id === id ? data : todo;
      });
    });
    showNotification({
      title: "To Do List",
      message: "To Do was updated!",
      icon: <Check />,
      color: "teal",
    });
  };

  const deleteTodo = (id) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });
    showNotification({
      title: "To Do List",
      message: "To Do was deleted!",
      icon: <Check />,
      color: "teal",
    });
  };

  const value = {
    todosFiltered,
    filter,
    formOpened,
    payloadAtForm,
    loggedIn,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    openForm,
    setPayloadAtForm,
    setLoggedIn,
  };

  return <TodolistContext.Provider value={value} {...props} />;
}

export function useTodolist() {
  const context = useContext(TodolistContext);
  if (!context) {
    throw new Error(
      "useTodolist debe estar dentro del proveedor TodolistContext"
    );
  }
  return context;
}

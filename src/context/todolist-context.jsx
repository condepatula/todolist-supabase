import { createContext, useState, useEffect, useContext } from "react";
import { data } from "../db";

const TodolistContext = createContext();

export function TodolistProvider(props) {
  const [todos, setTodos] = useState(data);
  const [todosFiltered, setTodosFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");

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

  const updateTodo = (id, data) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        return todo.id === id ? data : todo;
      });
    });
  };

  const value = {
    todosFiltered,
    filter,
    setFilter,
    updateTodo,
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

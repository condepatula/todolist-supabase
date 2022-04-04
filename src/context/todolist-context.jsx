import { createContext, useState, useEffect, useContext } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { supabase } from "../api/client";
//import { data } from "../db";

const TodolistContext = createContext();

export function TodolistProvider(props) {
  const [todos, setTodos] = useState([]);
  const [todosFiltered, setTodosFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [formOpened, openForm] = useState(false);
  const [payloadAtForm, setPayloadAtForm] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const todolistSubscription = supabase
      .from("todos")
      .on("INSERT", (_) => {
        fetchTodos();
      })
      .on("UPDATE", (_) => {
        fetchTodos();
      })
      .on("DELETE", (_) => {
        fetchTodos();
      })
      .subscribe();

    async function removeTodolistSubscription() {
      await supabase.removeSubscription(todolistSubscription);
    }

    return () => {
      removeTodolistSubscription();
    };
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

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

  const fetchTodos = async () => {
    const { data } = await supabase.from("todos").select();
    setTodos(data);
  };

  const addTodo = async (todo) => {
    //setTodos((prev) => [...prev, { ...todo, id: todos.length + 1 }]);
    const { error } = await supabase.from("todos").insert([todo]).single();
    if (!error) {
      showNotification({
        title: "To Do List",
        message: "To Do was added!",
        icon: <Check />,
        color: "teal",
      });
    }
  };

  const updateTodo = async (id, data) => {
    /*setTodos((prev) => {
      return prev.map((todo) => {
        return todo.id === id ? data : todo;
      });
    });*/
    const { error } = await supabase.from("todos").update(data).match({ id });

    if (!error) {
      showNotification({
        title: "To Do List",
        message: "To Do was updated!",
        icon: <Check />,
        color: "teal",
      });
    }
  };

  const deleteTodo = async (id) => {
    /*setTodos((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });*/
    const { error } = await supabase.from("todos").delete().match({ id });

    if (!error) {
      showNotification({
        title: "To Do List",
        message: "To Do was deleted!",
        icon: <Check />,
        color: "teal",
      });
    }
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

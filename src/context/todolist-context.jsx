import { createContext, useState, useEffect, useContext } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { supabase } from "../api/client";

const TodolistContext = createContext();

export function TodolistProvider(props) {
  const [todos, setTodos] = useState([]);
  const [todosFiltered, setTodosFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [formOpened, openForm] = useState(false);
  const [payloadAtForm, setPayloadAtForm] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        const { data } = await supabase
          .from("todos")
          .select()
          .eq("user_id", user.id)
          .order("id", { ascending: false });
        setTodos(data);
      }
    };

    fetchTodos();
  }, [user]);

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setLoggedIn(true);
      getUserProfile(user);
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setTodos([]);
        setTodosFiltered([]);
        getUserProfile(session.user);
        setLoggedIn(true);
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoggedIn(false);
      }
    });

    return () => data.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        const { data } = await supabase
          .from("todos")
          .select()
          .eq("user_id", user.id)
          .order("id", { ascending: false });
        setTodos(data);
      }
    };

    let todolistSubscription;

    if (user) {
      //console.log("subscribing....");
      todolistSubscription = supabase
        .from("todos")
        .on("INSERT", (_) => {
          fetchTodos();
        })
        .on("UPDATE", (_) => {
          console.log("updating...");
          fetchTodos();
        })
        .on("DELETE", (_) => {
          fetchTodos();
        })
        .subscribe();

      console.log("Subscribing", todolistSubscription);
    }

    async function removeTodolistSubscription() {
      //console.log("onsubscribe...");
      await supabase.removeSubscription(todolistSubscription);
    }

    return () => {
      //console.log("User", user);
      //console.log("Onsubscribing 1", todolistSubscription);
      if (todolistSubscription !== undefined) {
        console.log("Removing", todolistSubscription);
        removeTodolistSubscription();
      }
      //if (!user && todolistSubscription === "undefined") {
      /*if (todolistSubscription !== "undefined") {
        console.log("Onsubscribing 2", todolistSubscription);
        removeTodolistSubscription();
      }*/
      //}
    };
  }, [user]);

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

  const addTodo = async (todo) => {
    const { error } = await supabase
      .from("todos")
      .insert([{ ...todo, user_id: user.id }])
      .single();

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

  const getUserProfile = async (user) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      setUser({ id: user.id, name: data.username, email: user.email });
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    todosFiltered,
    filter,
    formOpened,
    payloadAtForm,
    loggedIn,
    user,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    openForm,
    setPayloadAtForm,
    setLoggedIn,
    setUser,
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

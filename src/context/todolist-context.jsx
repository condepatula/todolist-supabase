import { createContext, useState, useEffect, useContext } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { supabase } from "../api/client";
import { useUser } from "./user-context";
import moment from "moment";
import { useMantineTheme } from "@mantine/core";

const TodolistContext = createContext();

export function TodolistProvider(props) {
  const theme = useMantineTheme();
  const [todos, setTodos] = useState([]);
  const [todosFiltered, setTodosFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [formOpened, openForm] = useState(false);
  const [payloadAtForm, setPayloadAtForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date());

  //const [loggedIn, setLoggedIn] = useState(false);
  const { user } = useUser();
  //const [user, setUser] = useState(null);

  //const user = supabase.auth.user();

  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        const { data } = await supabase
          .from("todos")
          .select()
          .eq("user_id", user.id)
          .order("id", { ascending: false });
        setTodos(data);
      } else {
        setTodos([]);
      }
    };
    fetchTodos();
  }, [user]);

  /*useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setLoggedIn(true);
      getUserProfile(user);
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setTodos([]);
        setTodosFiltered([]);
        getUserProfile({ ...session.user, token: session.access_token });
        setLoggedIn(true);
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoggedIn(false);
      }
    });

    return () => data.unsubscribe();
  }, []);*/

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

      //console.log("Subscribing", todolistSubscription);
    }

    async function removeTodolistSubscription() {
      //console.log("onsubscribe...");
      await supabase.removeSubscription(todolistSubscription);
    }

    return () => {
      //console.log("User", user);
      //console.log("Onsubscribing 1", todolistSubscription);
      if (todolistSubscription !== undefined) {
        //console.log("Removing", todolistSubscription);
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
          return (
            todo.done &&
            moment(todo.date_at).format("DD/MM/yyyy") ===
              moment(dateFilter).format("DD/MM/yyyy")
          );
        }
        if (filter === "PENDING") {
          return (
            !todo.done &&
            moment(todo.date_at).format("DD/MM/yyyy") ===
              moment(dateFilter).format("DD/MM/yyyy")
          );
        }
        return (
          moment(todo.date_at).format("DD/MM/yyyy") ===
          moment(dateFilter).format("DD/MM/yyyy")
        );
      })
    );
  }, [todos, filter, dateFilter]);

  const addTodo = async (todo) => {
    setLoading(true);
    const { error } = await supabase
      .from("todos")
      .insert([{ ...todo, user_id: user.id }])
      .single();

    if (!error) {
      showNotification({
        message: "Task was added!",
        icon: <Check />,
        color: "teal",
      });
    }
    setLoading(false);
  };

  const updateTodo = async (id, data) => {
    const { error } = await supabase.from("todos").update(data).match({ id });

    if (!error) {
      showNotification({
        message: "Task was updated!",
        icon: <Check />,
        color: "teal",
      });
    }
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().match({ id });

    if (!error) {
      showNotification({
        message: "Task was deleted!",
        icon: <Check />,
        color: "teal",
      });
    }
  };

  /*const getUserProfile = async (user) => {
    console.log("User Data", user);
    try {
      const { data } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      setUser({
        id: user.id,
        name: data.username,
        firstname: data.firstname,
        email: user.email,
        avatarUrl: data.avatar_url,
        token: user.access_token,
      });
    } catch (error) {
      console.log(error);
    }
  };*/

  const getColorDay = (date) => {
    let done = 0;
    let notDone = 0;
    let color = null;
    todos.forEach((todo) => {
      if (
        moment(todo.date_at).format("DD/MM/yyyy") ===
        moment(date).format("DD/MM/yyyy")
      ) {
        if (!todo.done) {
          notDone++;
        } else {
          done++;
        }
      }
    });
    if (notDone > 0) color = `${theme.colors.red[2]}`;
    if (done > 0 && notDone === 0) color = `${theme.colors.green[2]}`;
    return color;
  };

  const value = {
    todosFiltered,
    filter,
    formOpened,
    payloadAtForm,
    //loggedIn,
    user,
    loading,
    dateFilter,
    setTodos,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    openForm,
    setPayloadAtForm,
    setDateFilter,
    getColorDay,
    //setLoggedIn,
    /*setUser,
    getUserProfile,*/
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

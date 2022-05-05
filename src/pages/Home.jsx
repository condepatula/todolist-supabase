import { Box, Text } from "@mantine/core";
import { supabase } from "../api/client";
import { Calendar } from "../components/_calendar";
import { Filter } from "../components/_filter";
import { FormTodo } from "../components/_formTodo";
import { TodoList } from "../components/_todoList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/user-context";

export const Home = () => {
  const { /*user,*/ emailConfirmed } = useUser();
  const navigate = useNavigate();
  const user = supabase.auth.user();

  useEffect(() => {
    if (!user && emailConfirmed) {
      navigate("/login");
    }
  }, [user, navigate, emailConfirmed]);

  if (!emailConfirmed) {
    return (
      <Text size="xs">
        An email has been sent to confirm your registration.
      </Text>
    );
  }

  if (!user) {
    return <Text size="xs">Loading...</Text>;
  }

  return (
    <Box sx={{ height: "100vh" }}>
      <FormTodo />
      <Filter />
      <Calendar />
      <TodoList />
    </Box>
  );
};

import { Box, Text } from "@mantine/core";
import { Calendar } from "../components/_calendar";
import { Filter } from "../components/_filter";
import { FormTodo } from "../components/_formTodo";
import { TodoList } from "../components/_todoList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/user-context";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

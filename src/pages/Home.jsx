import { Box, Text } from "@mantine/core";
import { supabase } from "../api/client";
import { Calendar } from "../components/_calendar";
import { Filter } from "../components/_filter";
import { FormTodo } from "../components/_formTodo";
import { TodoList } from "../components/_todoList";

export const Home = () => {
  const user = supabase.auth.user();

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

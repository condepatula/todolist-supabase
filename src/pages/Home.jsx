import { Box } from "@mantine/core";
import { Filter } from "../components/_filter";
import { FormTodo } from "../components/_formTodo";
import { TodoList } from "../components/_todoList";

export const Home = () => {
  return (
    <Box sx={{ height: "100vh" }}>
      <FormTodo />
      <Filter />
      <TodoList />
    </Box>
  );
};

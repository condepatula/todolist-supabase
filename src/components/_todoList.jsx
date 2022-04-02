import { Box, Image, Center, Text } from "@mantine/core";
import logo from "../assets/img/no-data-found.svg";
import { useTodolist } from "../context/todolist-context";
import { Todo } from "./_todo";

export const TodoList = ({ setOpened, setTask }) => {
  const { todosFiltered } = useTodolist();

  if (todosFiltered.length === 0) {
    return (
      <Center mt={20}>
        <Box sx={{ textAlign: "center" }} mt={50}>
          <Image src={logo} width={200} />
          <Text size="sm">No data found...</Text>
        </Box>
      </Center>
    );
  }

  const buildTodo = todosFiltered.map((todo) => {
    return (
      <Todo key={todo.id} todo={todo} setOpened={setOpened} setTask={setTask} />
    );
  });

  return (
    <Box ml={40} mt={40} mr={40}>
      {buildTodo}
    </Box>
  );
};

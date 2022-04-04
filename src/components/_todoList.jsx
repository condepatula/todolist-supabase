import { Box, Image, Center, Text, ScrollArea } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import logo from "../assets/img/no-data-found.svg";
import { useTodolist } from "../context/todolist-context";
import { Todo } from "./_todo";

export const TodoList = () => {
  const { todosFiltered } = useTodolist();
  const matches = useMediaQuery("(min-width:900px)");

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
    return <Todo key={todo.id} todo={todo} />;
  });

  return matches ? (
    <ScrollArea sx={{ height: 400 }} p={10} offsetScrollbars>
      {buildTodo}
    </ScrollArea>
  ) : (
    <Box>{buildTodo}</Box>
  );
};

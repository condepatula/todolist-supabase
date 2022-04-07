import {
  Divider,
  Grid,
  Group,
  Text,
  Box,
  Checkbox,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { Trash, Edit } from "tabler-icons-react";
import { useTodolist } from "../context/todolist-context";

export const Todo = ({ todo }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { openForm, setPayloadAtForm, updateTodo, deleteTodo } = useTodolist();

  return (
    <>
      <Grid mt="sm" mb="sm" sx={{ alignItems: "center" }}>
        <Grid.Col span={6}>
          <Box sx={{ display: "flex" }}>
            <Checkbox
              checked={todo.done}
              size="xs"
              onChange={() =>
                updateTodo(todo.id, { ...todo, done: !todo.done })
              }
              color="green"
            />
            <Text
              size="xs"
              sx={{
                maxWidth: "80vw",
                minWidth: "0",
                padding: ".5em",
                wordWrap: "break-word",
                textDecoration: todo.done ? "line-through" : "",
              }}
            >
              {todo.task}
            </Text>
          </Box>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <ActionIcon
              onClick={() => {
                openForm(true);
                setPayloadAtForm(todo);
              }}
              variant="hover"
              mr={15}
              sx={(theme) => ({
                color: theme.colors.gray[6],
                "&:hover": {
                  color: theme.colors.blue[2],
                },
              })}
            >
              <Edit size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => deleteTodo(todo.id)}
              variant="hover"
              sx={(theme) => ({
                color: theme.colors.gray[6],
                "&:hover": {
                  color: theme.colors.red[6],
                },
              })}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
      <Divider
        sx={{ borderColor: colorScheme === "dark" ? "" : theme.colors.gray[2] }}
      />
    </>
  );
};

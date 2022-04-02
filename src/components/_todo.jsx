import {
  Group,
  Divider,
  Checkbox,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { Trash, Edit } from "tabler-icons-react";
import { useTodolist } from "../context/todolist-context";

export const Todo = ({ todo, setOpened, setTask }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { updateTodo } = useTodolist();

  return (
    <>
      <Group mt={5} mb={10} position="apart">
        <Checkbox
          label={todo.task}
          checked={todo.done}
          size="xs"
          onChange={() => updateTodo(todo.id, { ...todo, done: !todo.done })}
          color="green"
        />
        <Group position="right">
          <ActionIcon
            onClick={() => {
              setOpened(true);
              setTask(todo);
            }}
            variant="hover"
          >
            <Edit size={16} />
          </ActionIcon>
          <ActionIcon onClick={() => console.log("delete")} variant="hover">
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <Divider
        sx={{ borderColor: colorScheme === "dark" ? "" : theme.colors.gray[2] }}
      />
    </>
  );
};

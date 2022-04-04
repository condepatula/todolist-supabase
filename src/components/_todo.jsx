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

export const Todo = ({ todo }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { openForm, setPayloadAtForm, updateTodo } = useTodolist();

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
              openForm(true);
              setPayloadAtForm(todo);
            }}
            variant="hover"
            mr={15}
            sx={(theme) => ({
              "&:hover": {
                color: theme.colors.blue[2],
              },
            })}
          >
            <Edit size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => console.log("delete")}
            variant="hover"
            sx={(theme) => ({
              "&:hover": {
                color: theme.colors.red[6],
              },
            })}
          >
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

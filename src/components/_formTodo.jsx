import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextInput,
  Group,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useTodolist } from "../context/todolist-context";

export const FormTodo = ({ opened, setOpened, task }) => {
  const theme = useMantineTheme();
  const focusTrapRef = useFocusTrap();
  const [input, setInput] = useState("");
  const { updateTodo } = useTodolist();

  useEffect(() => {
    task ? setInput(task.task) : setInput("");
  }, [task]);

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={task ? "Edit Task" : "Add Task"}
      padding="xl"
      size="sm"
      position="bottom"
    >
      <Box sx={{ maxWidth: 400 }} mx="auto">
        <form
          ref={focusTrapRef}
          onSubmit={(e) => {
            e.preventDefault();
            updateTodo(task.id, { ...task, task: input });
            setOpened(false);
          }}
        >
          <TextInput
            data-autofocus
            required
            label="Task"
            placeholder="Task"
            width="100%"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Group position="right" mt="md">
            <Button type="submit" sx={{ width: "100%" }} color="teal">
              Add
            </Button>
          </Group>
        </form>
      </Box>
    </Drawer>
  );
};

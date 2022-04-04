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

export const FormTodo = () => {
  const theme = useMantineTheme();
  const focusTrapRef = useFocusTrap();
  const [input, setInput] = useState("");
  const { formOpened, payloadAtForm, openForm, updateTodo } = useTodolist();

  useEffect(() => {
    payloadAtForm ? setInput(payloadAtForm.task) : setInput("");
  }, [payloadAtForm]);

  return (
    <Drawer
      opened={formOpened}
      onClose={() => openForm(false)}
      title={payloadAtForm ? "Edit Task" : "Add Task"}
      padding="xl"
      size="sm"
      position="bottom"
    >
      <Box sx={{ maxWidth: 400 }} mx="auto">
        <form
          ref={focusTrapRef}
          onSubmit={(e) => {
            e.preventDefault();
            updateTodo(payloadAtForm.id, { ...payloadAtForm, task: input });
            openForm(false);
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
              {payloadAtForm ? "Update" : "Add"}
            </Button>
          </Group>
        </form>
      </Box>
    </Drawer>
  );
};

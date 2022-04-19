import { useState, useEffect } from "react";
import { Drawer, Box, Textarea, Group, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useFocusTrap, useMediaQuery } from "@mantine/hooks";
import { useTodolist } from "../context/todolist-context";

export const FormTodo = () => {
  const isMobile = useMediaQuery("(max-width: 755px)");
  const focusTrapRef = useFocusTrap();
  const [input, setInput] = useState("");
  const [dateAt, setDateAt] = useState(new Date());
  const { loading, formOpened, payloadAtForm, openForm, addTodo, updateTodo } =
    useTodolist();

  useEffect(() => {
    if (payloadAtForm) {
      setInput(payloadAtForm.task);
      setDateAt(payloadAtForm.dateAt);
    } else {
      setInput("");
      setDateAt(new Date());
    }
  }, [payloadAtForm]);

  return (
    <Drawer
      opened={formOpened}
      onClose={() => openForm(false)}
      title={payloadAtForm ? "Edit Task" : "Add Task"}
      padding="xl"
      size="md"
      position="bottom"
    >
      <Box sx={{ maxWidth: 400 }} mx="auto">
        <form
          ref={focusTrapRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (payloadAtForm) {
              updateTodo(payloadAtForm.id, {
                ...payloadAtForm,
                task: input,
                date_at: dateAt,
              });
            } else {
              addTodo({ task: input, date_at: dateAt, done: false });
              setInput("");
            }
            openForm(false);
          }}
        >
          <DatePicker
            dropdownType={isMobile ? "modal" : "popover"}
            mb="sm"
            placeholder="Pick date"
            label="Date"
            required
            value={dateAt}
            onChange={setDateAt}
          />
          <Textarea
            data-autofocus
            required
            label="Task"
            placeholder="Task"
            width="100%"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Group position="right" mt="md">
            <Button
              type="submit"
              sx={{ width: "100%" }}
              color="teal"
              loading={loading}
            >
              {payloadAtForm
                ? loading
                  ? "Updating"
                  : "Update"
                : loading
                ? "Adding"
                : "Add"}
            </Button>
          </Group>
        </form>
      </Box>
    </Drawer>
  );
};

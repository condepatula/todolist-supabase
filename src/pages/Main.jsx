import { AppShell, Paper, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FormTodo } from "../components/_formTodo";
import { Filter } from "../components/_filter";
import { TodoList } from "../components/_todoList";
import { TodolistProvider } from "../context/todolist-context";
import { Header } from "../components/_header";

export const Main = () => {
  const matches = useMediaQuery("(min-width:900px)");

  return (
    <TodolistProvider>
      <Paper radius={0} sx={{ height: matches ? "100vh" : "" }}>
        <AppShell padding={0} header={<Header />}>
          <Box
            sx={{
              maxWidth: "980px",
              margin: "auto",
              height: "100%",
              padding: "10px",
            }}
          >
            <FormTodo />
            <Filter />
            <TodoList />
          </Box>
        </AppShell>
      </Paper>
    </TodolistProvider>
  );
};

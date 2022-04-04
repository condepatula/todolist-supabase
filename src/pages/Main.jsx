import { AppShell, Paper, Box } from "@mantine/core";
import { FormTodo } from "../components/_formTodo";
import { Filter } from "../components/_filter";
import { TodoList } from "../components/_todoList";
import { TodolistProvider } from "../context/todolist-context";
import { Header } from "../components/_header";

export const Main = () => {
  return (
    <TodolistProvider>
      <AppShell padding={0} header={<Header />}>
        <Paper
          radius={0}
          sx={{
            height: "100vh",
          }}
          p={10}
        >
          <Box
            sx={{
              maxWidth: "980px",
              margin: "auto",
              height: "100%",
              padding: "20px",
            }}
          >
            <FormTodo />
            <Filter />
            <TodoList />
          </Box>
        </Paper>
      </AppShell>
    </TodolistProvider>
  );
};

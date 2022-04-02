import { useState } from "react";
import {
  AppShell,
  Header,
  Group,
  useMantineColorScheme,
  Paper,
  Box,
} from "@mantine/core";
import { Logo } from "../components/_logo";
import { Actions } from "../components/_actions";
import { FormTodo } from "../components/_formTodo";
import { Filter } from "../components/_filter";
import { TodoList } from "../components/_todoList";
import { TodolistProvider } from "../context/todolist-context";

export const Main = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [opened, setOpened] = useState(false);
  const [task, setTask] = useState({});

  return (
    <AppShell
      padding={0}
      header={
        <Header height={48} p="xs">
          <Group
            sx={{
              maxHeight: "100%",
              maxWidth: "980px",
              margin: "auto",
            }}
            position="apart"
          >
            <Logo colorScheme={colorScheme} />
            <Actions
              setLoggedIn={setLoggedIn}
              toggleColorScheme={toggleColorScheme}
              colorScheme={colorScheme}
              loggedIn={loggedIn}
              setOpened={setOpened}
              setTask={setTask}
            />
          </Group>
        </Header>
      }
    >
      <Paper
        radius={0}
        sx={{
          height: "100vh",
        }}
        p={10}
      >
        <Box sx={{ maxWidth: "980px", margin: "auto", height: "100%" }}>
          <TodolistProvider>
            <FormTodo opened={opened} setOpened={setOpened} task={task} />
            <Filter />
            <TodoList setOpened={setOpened} setTask={setTask} />
          </TodolistProvider>
        </Box>
      </Paper>
    </AppShell>
  );
};

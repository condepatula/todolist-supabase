import React, { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useColorScheme } from '@mantine/hooks';
import { Main } from "./pages/Main";
import { TodolistProvider } from "./context/todolist-context";
import "./App.css";

const App = () => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme: colorScheme }}>
        <NotificationsProvider position="top-left" zIndex={2077}>
          <TodolistProvider>
            <Main />
          </TodolistProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;

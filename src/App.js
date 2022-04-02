import React, { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { Main } from "./pages/Main";
import "./App.css";

const App = () => {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme: colorScheme }}>
        <Main />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;

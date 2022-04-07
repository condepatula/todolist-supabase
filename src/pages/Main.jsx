import { AppShell, Paper, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../components/_header";
import { Signup } from "../components/_signup";
import { Home } from "./Home";
import { Login } from "../components/_login";
import { Landing } from "./Landing";
import { useTodolist } from "../context/todolist-context";
import { PageNotFound } from "./PageNotFound";

export const Main = () => {
  const matches = useMediaQuery("(min-width:900px)");
  const { loggedIn } = useTodolist();

  return (
    <Paper radius={0} sx={{ height: matches ? "100vh" : "" }}>
      <Router>
        <AppShell padding={0} header={<Header />}>
          <Box
            sx={{
              maxWidth: "980px",
              margin: "auto",
              height: "100%",
              padding: "10px",
            }}
          >
            {loggedIn ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            )}
          </Box>
        </AppShell>
      </Router>
    </Paper>
  );
};

import { AppShell, Paper, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../components/_header";
import { Signup } from "../components/_signup";
import { Home } from "./Home";
import { Login } from "../components/_login";
import { Landing } from "./Landing";
import { PageNotFound } from "./PageNotFound";
import { Profile } from "../components/_profile";
import { useUser } from "../context/user-context";

export const Main = () => {
  const matches = useMediaQuery("(min-width:900px)");
  const { user } = useUser();

  return (
    <Paper radius={0} sx={{ height: matches ? "100vh" : "" }}>
      <Router>
        <AppShell padding={0} header={<Header />} fixed>
          <Box
            sx={{
              maxWidth: "980px",
              margin: "auto",
              height: "100%",
              padding: "10px",
            }}
          >
            {user ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
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

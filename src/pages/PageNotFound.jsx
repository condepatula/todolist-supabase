import { Box, Image, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import logo from "../assets/img/page-not-found.svg";
import { useTodolist } from "../context/todolist-context";

export const PageNotFound = () => {
  const matches = useMediaQuery("(min-width:900px)");
  const { loggedIn } = useTodolist();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        marginTop: "100px",
        justifyContent: "center",
      }}
    >
      <Box>
        <Group position="center">
          <Text
            mb={30}
            weight={500}
            sx={{ fontSize: matches ? "30px" : "20px" }}
          >
            Page not found!
          </Text>
        </Group>
        <Image src={logo} width={200} />
        <Group position="center" mt={20} spacing={0}>
          <Text size={matches ? "md" : "xs"}>Go</Text>
          {loggedIn ? (
            <Link to="/">
              <Button
                size={matches ? "md" : "xs"}
                variant="subtle"
                compact
                color="teal"
              >
                Home
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                size={matches ? "md" : "xs"}
                variant="subtle"
                compact
                color="indigo"
              >
                Login
              </Button>
            </Link>
          )}
        </Group>
      </Box>
    </Box>
  );
};

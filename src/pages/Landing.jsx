import { Box, Image, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import logo from "../assets/img/landing-logo.svg";

export const Landing = () => {
  const matches = useMediaQuery("(min-width:900px)");

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
            Welcome To Do List App!
          </Text>
        </Group>
        <Image src={logo} width={matches ? 500 : 300} />
        <Group position="center" mt={20} spacing={1}>
          <Text size={matches ? "md" : "xs"}>
            If you already have an account
          </Text>
          <Link to="/login">
            <Button
              size={matches ? "md" : "xs"}
              variant="subtle"
              compact
              color="teal"
            >
              Login
            </Button>
          </Link>
          <Text size={matches ? "md" : "xs"}>or if you are not registered</Text>
          <Link to="/signup">
            <Button
              size={matches ? "md" : "xs"}
              variant="subtle"
              compact
              color="indigo"
            >
              Signup
            </Button>
          </Link>
        </Group>
      </Box>
    </Box>
  );
};

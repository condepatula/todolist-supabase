import {
  Input,
  Button,
  Text,
  InputWrapper,
  Box,
  Image,
  Divider,
  Group,
} from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import { At, X } from "tabler-icons-react";
import loginLogo from "../assets/img/login.png";

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      showNotification({
        message: "Welcome!",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        message: error.message,
        icon: <X />,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <Group spacing={5}>
        <Image src={loginLogo} width={40} />
        <Text mt={10} weight={500} size="xl">
          Login
        </Text>
      </Group>
      <Divider mb={50} />
      <Box sx={{ maxWidth: "500px", margin: "auto" }}>
        <form onSubmit={(e) => login(e)}>
          <InputWrapper id="email" label="Email" required mb={10}>
            <Input
              id="email"
              icon={<At />}
              placeholder="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper id="password" label="Password" required mb={10}>
            <Input
              id="password"
              placeholder="Your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <Button
            fullWidth
            mt={30}
            color="teal"
            size="md"
            type="submit"
            loading={loading}
          >
            {loading ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

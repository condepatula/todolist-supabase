import {
  Input,
  Button,
  Text,
  InputWrapper,
  Box,
  Group,
  Divider,
  Image,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import { useTodolist } from "../context/todolist-context";
import { At, Check, X } from "tabler-icons-react";
import signupLogo from "../assets/img/signup.png";

export const Signup = () => {
  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useTodolist();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      showNotification({
        message: "Account has created!",
        icon: <Check />,
        color: "teal",
      });
      console.log(user);
      createProfile(user.id);
      setLoggedIn(true);
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

  const createProfile = async (id) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({ id, updated_at: new Date(), username })
        .single();
      if (error) throw error;
      console.log(data);
      setUser({ id: data.id, name: data.username, email });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <Group spacing={5}>
        <Image src={signupLogo} width={40} />
        <Text mt={10} weight={500} size="xl">
          Signup
        </Text>
      </Group>
      <Divider mb={50} />
      <Box sx={{ maxWidth: "500px", margin: "auto" }}>
        <form onSubmit={(e) => signup(e)}>
          <InputWrapper id="username" label="User name" required mb={10}>
            <Input
              id="username"
              placeholder="Your user name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputWrapper>
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
          <InputWrapper id="confirm-password" label="Confirm Password" required>
            <Input
              id="confirm-password"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

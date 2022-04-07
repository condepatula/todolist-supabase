import {
  Button,
  Text,
  Box,
  Group,
  Divider,
  Image,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import { useTodolist } from "../context/todolist-context";
import { Check, X, EyeCheck, EyeOff } from "tabler-icons-react";
import signupLogo from "../assets/img/signup.png";

export const Signup = () => {
  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useTodolist();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) =>
        value.length < 10 ? "Must be 10 or more characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const signUp = async (data) => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      showNotification({
        message: "Account has created!",
        icon: <Check />,
        color: "teal",
      });
      createProfile(user.id, data.username, data.email);
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

  const createProfile = async (id, username, email) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({ id, updated_at: new Date(), username })
        .single();
      if (error) throw error;
      setUser({ id: data.id, name: data.username, email });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <Group sx={{ display: "flex", alignItems: "center" }} spacing={5}>
        <Image src={signupLogo} width={40} />
        <Text weight={500} size="xl">
          Sign up
        </Text>
      </Group>
      <Divider mb="xl" mt="sm" />
      <Box sx={{ maxWidth: "500px", margin: "auto" }} pl={10} pr={10}>
        <form onSubmit={form.onSubmit((values) => signUp(values))}>
          <TextInput
            required
            description="Username must be 10 or more characters"
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
          />
          <TextInput
            mt="sm"
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            mt="sm"
            required
            label="Password"
            placeholder="Password"
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
            {...form.getInputProps("password")}
          />

          <PasswordInput
            mt="sm"
            required
            label="Confirm password"
            placeholder="Confirm password"
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            fullWidth
            mt={30}
            color="teal"
            size="md"
            type="submit"
            loading={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

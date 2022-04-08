import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Box,
  Image,
  Divider,
  Group,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import { X, EyeOff, EyeCheck } from "tabler-icons-react";
import loginLogo from "../assets/img/login.png";

export const Login = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const focusTrapRef = useFocusTrap();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length === 0 ? "Password is required" : null),
    },
  });

  const logIn = async (data) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        email: data.email,
        password: data.password,
      });
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
      <Group sx={{ display: "flex", alignItems: "center" }} spacing={5}>
        <Image src={loginLogo} width={40} />
        <Text weight={500} size="xl">
          Log in
        </Text>
      </Group>
      <Divider
        mb="xl"
        mt="sm"
        sx={{ borderColor: colorScheme === "dark" ? "" : theme.colors.gray[2] }}
      />
      <Box sx={{ maxWidth: "500px", margin: "auto" }} pl={10} pr={10}>
        <form
          ref={focusTrapRef}
          onSubmit={form.onSubmit((values) => logIn(values))}
        >
          <TextInput
            data-autofocus
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            mt="sm"
            label="Password"
            placeholder="Password"
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
            {...form.getInputProps("password")}
          />
          <Button
            fullWidth
            mt={30}
            color="teal"
            size="md"
            type="submit"
            loading={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Box>
    </Box>
  );

  /*return (
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
  );*/
};

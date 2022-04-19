import {
  Button,
  Text,
  Box,
  Group,
  Divider,
  Image,
  TextInput,
  PasswordInput,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import signupLogo from "../assets/img/signup.png";
import { useUser } from "../context/user-context";

export const Signup = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const focusTrapRef = useFocusTrap();
  const navigate = useNavigate();
  const { loading, signUp } = useUser();

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

  return (
    <Box sx={{ height: "100vh" }}>
      <Group sx={{ display: "flex", alignItems: "center" }} spacing={5}>
        <Image src={signupLogo} width={40} />
        <Text weight={500} size="xl">
          Sign up
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
          onSubmit={form.onSubmit((values) => signUp(values, navigate))}
        >
          <TextInput
            data-autofocus
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

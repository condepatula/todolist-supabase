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
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { EyeOff, EyeCheck } from "tabler-icons-react";
import loginLogo from "../assets/img/login.png";
import { useUser } from "../context/user-context";

export const Login = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const focusTrapRef = useFocusTrap();
  const navigate = useNavigate();
  const { loading, logIn } = useUser();

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
          onSubmit={form.onSubmit((values) => logIn(values, navigate))}
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
};

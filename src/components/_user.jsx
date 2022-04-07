import { forwardRef } from "react";
import {
  Group,
  Avatar,
  Text,
  UnstyledButton,
  Menu,
  Box,
  useMantineTheme,
  MediaQuery,
} from "@mantine/core";
import {
  User as Profile,
  Logout,
  ChevronRight,
  ChevronLeft,
} from "tabler-icons-react";
import { supabase } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useTodolist } from "../context/todolist-context";

export const User = ({ setLoggedIn }) => {
  const theme = useMantineTheme();
  const { user } = useTodolist();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const UserButton = forwardRef(
    ({ image, name, email, icon, ...others }, ref) => (
      <UnstyledButton
        ref={ref}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        {...others}
      >
        <Group
          sx={{
            maxHeight: "28px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MediaQuery smallerThan="sm" styles={{ marginTop: "0" }}>
            <Avatar src={image} radius="xl" size={30} mt={-5} />
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Box>
              <Text size="md" weight={500} mt={-5}>
                {name}
              </Text>
              <Text size="xs" color="dimmed" mt={-5}>
                {email}
              </Text>
            </Box>
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            {theme.dir === "ltr" ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </MediaQuery>
        </Group>
      </UnstyledButton>
    )
  );

  return (
    <Group position="center">
      <Menu
        withArrow
        placement="center"
        control={
          <UserButton
            image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            name={user && user.name}
            email={user && user.email}
          />
        }
      >
        <Menu.Item
          icon={<Profile size={16} />}
          onClick={() => console.log("Hello")}
        >
          Perfil
        </Menu.Item>
        <Menu.Item icon={<Logout size={16} />} onClick={() => logout()}>
          Logout
        </Menu.Item>
      </Menu>
    </Group>
  );
};

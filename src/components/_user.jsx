import { forwardRef, useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user-context";

export const User = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { account, logOut } = useUser();

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [publicURL, setPublicURL] = useState(null);

  useEffect(() => {
    if (account) {
      setUsername(account.username);
      setPublicURL(account.publicURL);
      setEmail(account.email);
    }
  }, [account]);

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
        control={<UserButton image={publicURL} name={username} email={email} />}
      >
        <Menu.Item
          icon={<Profile size={16} />}
          onClick={() => navigate("/profile")}
        >
          Profile
        </Menu.Item>
        <Menu.Item icon={<Logout size={16} />} onClick={() => logOut(navigate)}>
          Logout
        </Menu.Item>
      </Menu>
    </Group>
  );
};

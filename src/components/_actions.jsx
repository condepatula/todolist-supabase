import { Group, ActionIcon } from "@mantine/core";
import { Sun, MoonStars, Login, Plus } from "tabler-icons-react";
import { User } from "../components/_user";

export const Actions = ({
  setLoggedIn,
  toggleColorScheme,
  colorScheme,
  loggedIn,
  setOpened,
  setTask,
}) => {
  return (
    <Group position="apart">
      <ActionIcon onClick={() => toggleColorScheme()} variant="default">
        {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
      </ActionIcon>
      <ActionIcon
        onClick={() => {
          setOpened(true);
          setTask(null);
        }}
        variant="default"
      >
        <Plus size={16} />
      </ActionIcon>
      {!loggedIn ? (
        <ActionIcon
          onClick={() => setLoggedIn((prev) => !prev)}
          variant="default"
        >
          <Login />
        </ActionIcon>
      ) : (
        <User setLoggedIn={setLoggedIn} />
      )}
    </Group>
  );
};

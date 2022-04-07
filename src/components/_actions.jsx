import { Group, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Sun, MoonStars, Plus } from "tabler-icons-react";
import { User } from "../components/_user";
import { useTodolist } from "../context/todolist-context";

export const Actions = () => {
  const matches = useMediaQuery("(min-width:900px)");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { openForm, loggedIn, setPayloadAtForm } = useTodolist();

  return (
    <Group position="apart">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="default"
        mr={matches ? 0 : 5}
      >
        {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
      </ActionIcon>
      {loggedIn && (
        <ActionIcon
          onClick={() => {
            openForm(true);
            setPayloadAtForm(null);
          }}
          variant="default"
          mr={matches ? 0 : 5}
        >
          <Plus size={16} />
        </ActionIcon>
      )}
      {loggedIn && <User />}
    </Group>
  );
};

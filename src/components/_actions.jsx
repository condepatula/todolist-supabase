import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Sun, MoonStars, Plus } from "tabler-icons-react";
import { User } from "../components/_user";
import { useTodolist } from "../context/todolist-context";
import { useUser } from "../context/user-context";

export const Actions = () => {
  const theme = useMantineTheme();
  const matches = useMediaQuery("(min-width:900px)");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { openForm, setPayloadAtForm } = useTodolist();
  const { user } = useUser();

  return (
    <Group position="apart">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="default"
        mr={matches ? 0 : 5}
      >
        {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
      </ActionIcon>
      {user && (
        <Button
          size="xs"
          onClick={() => {
            openForm(true);
            setPayloadAtForm(null);
          }}
          variant="default"
          mr={matches ? 0 : 15}
          leftIcon={<Plus size={14} />}
          sx={{
            backgroundColor: theme.colors.yellow[3],
            border: "none",
            height: "28px",
          }}
        >
          Add task
        </Button>
      )}
      {user && <User />}
    </Group>
  );
};

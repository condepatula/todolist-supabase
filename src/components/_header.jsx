import {
  Header as HeaderMan,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { Actions } from "./_actions";
import { Logo } from "./_logo";

export const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <HeaderMan height={48} p="xs">
      <Group
        sx={{
          maxHeight: "100%",
          maxWidth: "980px",
          margin: "auto",
        }}
        position="apart"
      >
        <Logo colorScheme={colorScheme} />
        <Actions
          toggleColorScheme={toggleColorScheme}
          colorScheme={colorScheme}
        />
      </Group>
    </HeaderMan>
  );
};

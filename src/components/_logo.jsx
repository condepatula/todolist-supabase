import { Group, Image, Text } from "@mantine/core";
import logo from "../assets/img/logo.svg";

export const Logo = ({ colorScheme }) => {
  return (
    <Group spacing={10}>
      <Image src={logo} height={28} />
      <Text size="sm" color={colorScheme === "dark" ? "#fff" : "#000"}>
        To Do List
      </Text>
    </Group>
  );
};

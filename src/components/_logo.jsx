import { Group, Image, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.svg";

export const Logo = ({ colorScheme }) => {
  return (
    <Group spacing={10}>
      <Link to="/">
        <Image src={logo} height={28} />
      </Link>
      <Text size="sm" color={colorScheme === "dark" ? "#fff" : "#000"}>
        To Do List
      </Text>
    </Group>
  );
};
